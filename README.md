# is-search-bot

**is-search-bot** is a simple API to check whether a given IP address belongs to a search engine bot.

## Features

- Identifies if an IP address is from a known search engine bot.
- Provides details about the bot, including its name and additional information.
- Supports popular search engines such as Google, Bing, Apple, and Baidu.

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

- `success`: Boolean indicating if the query was processed successfully.
- `isBot`: Boolean indicating whether the IP belongs to a bot.
- `name`: The name of the search engine (e.g., "google", "bing", "apple", "baidu").
- `comment`: Additional details about the IP or bot.

## Supported Search Engines

The API currently supports identifying bots from the following search engines:

- **Google**  
- **Bing**  
- **Apple**  
- **Baidu**  

## Example IPs

- `66.249.66.9`: Known Googlebot IP.
- Try other public IPs to test their bot status.

## Installation and Deployment

No installation is required. Use the provided API endpoint to perform checks instantly.

## Use Cases

- **Bot Detection**: Identify traffic from search engine crawlers to manage and monitor bot activity.
- **Analytics Filtering**: Improve accuracy by filtering out bot-generated traffic.
- **Access Management**: Control access based on bot detection to optimize server resources.

## Notes

- Ensure the IP address provided is public and valid for accurate results.
- The API uses a maintained database of known search engine bot IPs to ensure reliability.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.