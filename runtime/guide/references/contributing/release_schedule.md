# Release Schedule

A new minor release for the `deno` cli is released every month, on the third
Thursday of the month.

See [Milestones on Deno's GitHub](https://github.com/denoland/deno/milestones)
for the upcoming releases.

There are usually two or three patch releases (done weekly) after a minor
releases; after that a merge window for new features opens for the upcoming
minor release.

Stable releases can be found on the
[GitHub releases page](https://github.com/denoland/deno/releases).

## Canary channel

In addition to the stable channel described above, canaries are released
multiple times daily (for each commit on main). You can upgrade to the latest
canary release by running:

```
deno upgrade --canary
```

To update to a specific canary, pass the commit hash in the `--version` option:

```
deno upgrade --canary --version=973af61d8bb03c1709f61e456581d58386ed4952
```

To switch back to the stable channel, run `deno upgrade`.

Canaries can be downloaded from https://dl.deno.land.
