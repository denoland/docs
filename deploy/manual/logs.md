# Application logging

Applications can generate logs at runtime using the console API. These logs can
be viewed in real time by navigating to the `Logs` panel of a project or
deployment. Logs will be streamed directly from an application to the log panel.

Logs are retained for a period of 24 hours. To view persisted logs, switch from
`Live` to either `Recent` or `Custom` in the dropdown menu next to the search
box. Logs older than 24 hours are automatically deleted from the system.

Log messages have a maximum size of 2kb. Messages larger than this are trimmed
to 2kb.
