# is-search-bot

**is-search-bot** is a simple API to check whether a given IP address belongs to a search engine bot.

## Features

- Identifies if an IP address originates from a known search engine bot.
- Performs reverse DNS lookups to validate bot status.
- Supports major search engines such as Google, Bing, Apple, and Baidu.

## Usage

### Endpoint

The API accepts a query parameter `ip` to check the IP address. Example:

```bash
curl -s https://is-search-bot.youxam.workers.dev/?ip=66.249.66.9 | jq
```

### Response Example

```json
{
  "success": true,
  "isBot": true,
  "name": "google",
  "comment": "This IP belongs to a known bot"
}
```

### Response Structure

- `success`: Boolean indicating whether the query was processed successfully.
- `isBot`: Boolean indicating whether the IP belongs to a bot.
- `name`: The name of the search engine (e.g., "google", "bing", "apple", "baidu").
- `comment`: Additional details about the IP or bot.

## Supported Search Engines

The API currently identifies bots from the following search engines:

- **Google**  
- **Bing**  
- **Apple**  
- **Baidu**  

## How It Works

1. **Reverse DNS Lookup**: The API resolves the hostname of the given IP address using reverse DNS.
2. **Validation**: It matches the resolved hostname against known patterns used by supported search engines.
3. **Response**: Provides detailed information if the IP is recognized as a bot.

## Example IPs

- `66.249.66.9`: Known Googlebot IP.
- Use other public IPs to test their bot status.

## Use Cases

- **Bot Detection**: Monitor and classify traffic from search engine crawlers.
- **Analytics Filtering**: Exclude bot traffic for more accurate web analytics.
- **Access Management**: Manage server resources by detecting and controlling bot access.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.