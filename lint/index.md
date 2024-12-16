---
title: Lint rules
templateEngine: [vto, md]
---

<div>

{{ for lintRule of lintRulePages }}

<div>
  <a href="{{ lintRule.href }}">{{ lintRule.label }}</a>
  {{ for tag of lintRule.tags }}
    <span class="lint-tag-{{ tag }}">{{ tag }}</span>
  {{/for }}
</div>

{{ /for }}

</div>
