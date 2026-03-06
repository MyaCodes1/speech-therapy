## GitHub Copilot Chat

- Extension Version: 0.22.4 (prod)
- VS Code: vscode/1.95.1
- OS: Mac

## Network

User Settings:
```json
  "github.copilot.advanced": {
    "debug.useElectronFetcher": true,
    "debug.useNodeFetcher": false
  }
```

Connecting to https://api.github.com:
- DNS ipv4 Lookup: 20.26.156.210 (16 ms)
- DNS ipv6 Lookup: ::ffff:20.26.156.210 (23 ms)
- Electron Fetcher (configured): HTTP 200 (67 ms)
- Node Fetcher: HTTP 200 (95 ms)
- Helix Fetcher: HTTP 200 (573 ms)

Connecting to https://api.individual.githubcopilot.com/_ping:
- DNS ipv4 Lookup: 140.82.112.22 (33 ms)
- DNS ipv6 Lookup: ::ffff:140.82.112.22 (18 ms)
- Electron Fetcher (configured): HTTP 200 (293 ms)
- Node Fetcher: HTTP 200 (297 ms)
- Helix Fetcher: HTTP 200 (317 ms)

## Documentation

In corporate networks: [Troubleshooting firewall settings for GitHub Copilot](https://docs.github.com/en/copilot/troubleshooting-github-copilot/troubleshooting-firewall-settings-for-github-copilot).