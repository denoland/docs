# Application logging

Applications can generate logs at runtime using the console API. These logs can
be viewed in real time by navigating to the `Logs` panel of a project or
deployment. Logs will be streamed directly from an application to the log panel.

These logs are **not persisted**. Only logs that are generated after the logs
page is opened can be viewed. After closing the logs page, all streamed logs are
discarded.

Log messages have a maximum size of 2kb. Messages larger than this are trimmed
to 2kb.
