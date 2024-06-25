export default function Header() {
  return (
    <nav class="px-8 py-2 sticky h-12 top-0 left-0 right-0 bg-white shadow flex items-center justify-between z-50">
      <a class="flex items-center gap-3" href="/">
        <div class="block size-6">
          <img src="/img/logo.svg" alt="Deno Docs" />
        </div>
        <b class="text-xl">Docs</b>
      </a>
    </nav>
  );
}
