use anyhow::Context;
use deno_doc::html::DocNodeWithContext;
use deno_doc::html::UrlResolveKind;
use deno_doc::DocNode;
use deno_graph::BuildOptions;
use deno_graph::ModuleSpecifier;
use futures::executor::block_on;
use futures::future;
use std::collections::HashMap;
use std::rc::Rc;

const SPECIFIER: &str = "asset://deno_types";
const DOCUSAURUS_ROOT: &str = "/api";

struct TypesLoader(String);

impl deno_graph::source::Loader for TypesLoader {
  fn load(
    &mut self,
    specifier: &deno_ast::ModuleSpecifier,
    _is_dynamic: bool,
    _cache_setting: deno_graph::source::CacheSetting,
  ) -> deno_graph::source::LoadFuture {
    let result = if specifier.as_str() == SPECIFIER {
      Ok(Some(deno_graph::source::LoadResponse::Module {
        specifier: specifier.clone(),
        maybe_headers: None,
        content: self.0.clone().into(),
      }))
    } else {
      Err(anyhow::anyhow!("Unexpected specifier"))
    };
    Box::pin(future::ready(result))
  }
}

fn main() {
  let future = async move {
    if let Err(err) = run().await {
      eprintln!("{}", err);
      std::process::exit(1);
    }
  };

  block_on(future);
}

async fn run() -> Result<(), anyhow::Error> {
  let out = std::process::Command::new("deno")
    .arg("types")
    .output()?
    .stdout;
  let module_specifier = ModuleSpecifier::parse(SPECIFIER)?;

  let mut graph =
    deno_graph::ModuleGraph::new(deno_graph::GraphKind::TypesOnly);

  let analyzer = deno_graph::CapturingModuleAnalyzer::default();

  let diagnostics = graph
    .build(
      vec![module_specifier.clone()],
      &mut TypesLoader(String::from_utf8(out)?),
      BuildOptions {
        module_analyzer: Some(&analyzer),
        ..Default::default()
      },
    )
    .await;
  assert!(diagnostics.is_empty());
  graph.valid()?;

  let parser = deno_doc::DocParser::new(
    &graph,
    &analyzer,
    deno_doc::DocParserOptions {
      diagnostics: false,
      private: false,
    },
  )?;

  let doc_nodes = parser.parse_with_reexports(&module_specifier)?;

  let files = generate(doc_nodes, module_specifier)?;

  let output_path = std::env::current_dir().unwrap().join("gen_out");
  for (path, content) in files {
    let path = output_path.join(path);
    std::fs::create_dir_all(path.parent().unwrap())?;
    std::fs::write(output_path.join(path), content)?;
  }

  Ok(())
}

struct DocusaurusResolver();

impl deno_doc::html::HrefResolver for DocusaurusResolver {
  fn resolve_path(
    &self,
    _current: UrlResolveKind,
    target: UrlResolveKind,
  ) -> String {
    // We dont have file or root index view, only all symbols (which we use as an index) and symbols

    match target {
      UrlResolveKind::Root => DOCUSAURUS_ROOT.to_string(), // potentially could be unreachable!()
      UrlResolveKind::AllSymbols => DOCUSAURUS_ROOT.to_string(),
      UrlResolveKind::File(_) => unreachable!(),
      UrlResolveKind::Symbol { symbol, .. } => {
        format!("{DOCUSAURUS_ROOT}/{symbol}")
      }
    }
  }

  fn resolve_global_symbol(&self, _symbol: &[String]) -> Option<String> {
    // We dont have access to any globals, including deno ns since we are documenting it
    None
  }

  fn resolve_import_href(
    &self,
    _symbol: &[String],
    _src: &str,
  ) -> Option<String> {
    // There are no imports
    None
  }

  fn resolve_usage(
    &self,
    _current_specifier: &deno_ast::ModuleSpecifier,
    _current_file: &str,
  ) -> Option<String> {
    // We dont want to show usage/import block since this is a global
    None
  }

  fn resolve_source(&self, _location: &deno_doc::Location) -> Option<String> {
    // We cannot link to the true source line, so we don't link to source whatsoever
    None
  }
}

fn generate(
  doc_nodes: Vec<DocNode>,
  module_specifier: ModuleSpecifier,
) -> Result<HashMap<String, String>, anyhow::Error> {
  let mut files = HashMap::new();

  let ctx = deno_doc::html::GenerateCtx {
    package_name: None,
    common_ancestor: None,
    main_entrypoint: Some(module_specifier.clone()),
    specifiers: vec![module_specifier.clone()],
    hbs: deno_doc::html::setup_hbs().unwrap(),
    href_resolver: Rc::new(DocusaurusResolver()),
    rewrite_map: None,
    hide_module_doc_title: true,
    tree_sitter_highlighter: deno_doc::html::setup_tree_sitter(),
    single_file_mode: true,
    sidebar_flatten_namespaces: true,
  };

  {
    // root/All Symbols
    let render_ctx = deno_doc::html::RenderContext::new(
      &ctx,
      &[],
      UrlResolveKind::AllSymbols,
      None,
    );

    let doc_nodes_with_context = doc_nodes
      .iter()
      .map(|node| DocNodeWithContext {
        origin: Some(ctx.url_to_short_path(&module_specifier)),
        doc_node: node.clone(),
      })
      .collect::<Vec<_>>();

    let partitions_by_kind = deno_doc::html::namespace::partition_nodes_by_kind(
      &doc_nodes_with_context,
      true,
    );

    let sections = deno_doc::html::namespace::render_namespace(
      &render_ctx,
      partitions_by_kind,
    );

    let breadcrumbs = ctx
      .hbs
      .render("breadcrumbs", &render_ctx.get_breadcrumbs())
      .context("failed to render breadcrumbs")?;
    let main = ctx
      .hbs
      .render(
        "symbol_content",
        &deno_doc::html::SymbolContentCtx {
          id: String::new(),
          sections,
          docs: None,
        },
      )
      .context("failed to all symbols list")?;

    files.insert("breadcrumbs.html".to_string(), breadcrumbs);
    files.insert("index.html".to_string(), main);
  }

  {
    // Symbols

    let short_path = ctx.url_to_short_path(&module_specifier);
    let partitions_for_nodes =
      deno_doc::html::get_partitions_for_file(&ctx, &doc_nodes, &short_path);

    dbg!(partitions_for_nodes.len());

    let symbol_pages = deno_doc::html::generate_symbol_pages_for_module(
      &ctx,
      &module_specifier,
      &short_path,
      &partitions_for_nodes,
      &doc_nodes,
    );

    files.extend(symbol_pages.iter().flat_map(
      |(breadcrumbs_ctx, sidepanel_ctx, symbol_group_ctx)| {
        let name = symbol_group_ctx.name.clone();
        let breadcrumbs = ctx
          .hbs
          .render("breadcrumbs", &breadcrumbs_ctx)
          .context("failed to render breadcrumbs")
          .unwrap();

        let sidepanel = ctx
          .hbs
          .render("sidepanel", &sidepanel_ctx)
          .context("failed to render sidepanel")
          .unwrap();

        let main = ctx
          .hbs
          .render("symbol_group", &symbol_group_ctx)
          .context("failed to render symbol group")
          .unwrap();

        [
          (format!("/{name}/breadcrumbs.html"), breadcrumbs),
          (format!("/{name}/sidepanel.html"), sidepanel),
          (format!("/{name}/main.html"), main),
        ]
      },
    ))
  }

  Ok(files)
}
