import { describe, it, expect } from "vitest";
import { toArpa, isIPv4, isIPv6, ipv4ToArpa, ipv6ToArpa, expandIPv6 } from "../src/ip";

describe("toArpa", () => {
    it("should convert valid IPv4 addresses to in-addr.arpa format", () => {
        expect(toArpa("192.168.1.1")).toBe("1.1.168.192.in-addr.arpa");
        expect(toArpa("127.0.0.1")).toBe("1.0.0.127.in-addr.arpa");
        expect(toArpa("0.0.0.0")).toBe("0.0.0.0.in-addr.arpa");
        expect(toArpa("255.255.255.255")).toBe("255.255.255.255.in-addr.arpa");
    });

    it("should convert valid IPv6 addresses to ip6.arpa format", () => {
        expect(toArpa("2001:db8::ff00:42:8329"))
            .toBe("9.2.3.8.2.4.0.0.0.0.f.f.0.0.0.0.0.0.0.0.0.0.0.0.8.b.d.0.1.0.0.2.ip6.arpa");
        expect(toArpa("::1"))
            .toBe("1.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.ip6.arpa");
        expect(toArpa("fe80::"))
            .toBe("0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.8.e.f.ip6.arpa");
        expect(toArpa("0:0:0:0:0:0:0:1"))
            .toBe("1.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.ip6.arpa");
    });

    it("should throw an error for invalid IP addresses", () => {
        expect(() => toArpa("invalid-ip")).toThrow("Invalid IP address");
        expect(() => toArpa("300.300.300.300")).toThrow("Invalid IP address");
        expect(() => toArpa("::gggg")).toThrow("Invalid IP address");
        expect(() => toArpa("1.1.1")).toThrow("Invalid IP address");
        expect(() => toArpa("1234:5678:9abc:defg::")).toThrow("Invalid IP address");
    });
});

describe("isIPv4", () => {
    it("should return true for valid IPv4 addresses", () => {
        expect(isIPv4("192.168.1.1")).toBe(true);
        expect(isIPv4("127.0.0.1")).toBe(true);
        expect(isIPv4("0.0.0.0")).toBe(true);
        expect(isIPv4("255.255.255.255")).toBe(true);
    });

    it("should return false for invalid IPv4 addresses", () => {
        expect(isIPv4("300.300.300.300")).toBe(false); // 超出范围
        expect(isIPv4("192.168.1")).toBe(false);       // 部分缺失
        expect(isIPv4("abcd")).toBe(false);            // 非数字字符
        expect(isIPv4("192.168.1.-1")).toBe(false);    // 负数
        expect(isIPv4("192.168.1.256")).toBe(false);   // 超过255
        expect(isIPv4("192.168.01.1")).toBe(true);     // 前导零，合法
        expect(isIPv4("192.168.1.1.1")).toBe(false);   // 多余部分
    });
});

describe("isIPv6", () => {
    it("should return true for valid IPv6 addresses", () => {
        expect(isIPv6("2001:db8::ff00:42:8329")).toBe(true);
        expect(isIPv6("::1")).toBe(true);
        expect(isIPv6("fe80::")).toBe(true);
        expect(isIPv6("0:0:0:0:0:0:0:1")).toBe(true);
        expect(isIPv6("2001:0db8:85a3:0000:0000:8a2e:0370:7334")).toBe(true);
    });

    it("should return false for invalid IPv6 addresses", () => {
        expect(isIPv6("2001:db8:::1")).toBe(false);    // 多个"::"
        expect(isIPv6("abcd")).toBe(false);            // 不足8组
        expect(isIPv6("3001::zzz")).toBe(false);       // 非法字符
        expect(isIPv6("2001::85a3::8a2e")).toBe(false); // 多个"::"
        expect(isIPv6("2001:db8:85a3:0:0:8a2e:370:7334:1234")).toBe(false); // 超过8组
        expect(isIPv6("::ffff:192.168.1.1")).toBe(false); // IPv4映射地址（不支持）
    });
});

describe("ipv4ToArpa", () => {
    it("should convert IPv4 to in-addr.arpa format", () => {
        expect(ipv4ToArpa("192.168.1.1")).toBe("1.1.168.192.in-addr.arpa");
        expect(ipv4ToArpa("8.8.8.8")).toBe("8.8.8.8.in-addr.arpa");
        expect(ipv4ToArpa("0.0.0.0")).toBe("0.0.0.0.in-addr.arpa");
        expect(ipv4ToArpa("255.255.255.255")).toBe("255.255.255.255.in-addr.arpa");
    });

    it("should throw an error for invalid IPv4 addresses", () => {
        expect(() => ipv4ToArpa("192.168.1")).toThrow("Invalid IPv4 address");
        expect(() => ipv4ToArpa("256.256.256.256")).toThrow("Invalid IPv4 address");
        expect(() => ipv4ToArpa("1234")).toThrow("Invalid IPv4 address");
        expect(() => ipv4ToArpa("abcd")).toThrow("Invalid IPv4 address");
    });
});

describe("ipv6ToArpa", () => {
    it("should convert IPv6 to ip6.arpa format", () => {
        expect(ipv6ToArpa("2001:db8::ff00:42:8329"))
            .toBe("9.2.3.8.2.4.0.0.0.0.f.f.0.0.0.0.0.0.0.0.0.0.0.0.8.b.d.0.1.0.0.2.ip6.arpa");
        expect(ipv6ToArpa("::1"))
            .toBe("1.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.ip6.arpa");
        expect(ipv6ToArpa("fe80::"))
            .toBe("0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.8.e.f.ip6.arpa");
        expect(ipv6ToArpa("0:0:0:0:0:0:0:1"))
            .toBe("1.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.ip6.arpa");
    });

    it("should throw an error for invalid IPv6 addresses", () => {
        expect(() => ipv6ToArpa("abcd")).toThrow("Invalid IPv6 address");
        expect(() => ipv6ToArpa("2001:db8:::1")).toThrow("Invalid IPv6 address");
        expect(() => ipv6ToArpa("gggg::1")).toThrow("Invalid IPv6 address");
        expect(() => ipv6ToArpa("1234:5678:9abc:defg::")).toThrow("Invalid IPv6 address");
    });
});

describe("expandIPv6", () => {
    it("should expand IPv6 addresses correctly", () => {
        expect(expandIPv6("2001:db8::ff00:42:8329"))
            .toBe("2001:0db8:0000:0000:0000:ff00:0042:8329");
        expect(expandIPv6("::1"))
            .toBe("0000:0000:0000:0000:0000:0000:0000:0001");
        expect(expandIPv6("fe80::"))
            .toBe("fe80:0000:0000:0000:0000:0000:0000:0000");
        expect(expandIPv6("0:0:0:0:0:0:0:1"))
            .toBe("0000:0000:0000:0000:0000:0000:0000:0001");
    });

    it("should return null for invalid IPv6 addresses", () => {
        expect(expandIPv6("abcd")).toBe(null);
        expect(expandIPv6("2001:db8:::1")).toBe(null);
        expect(expandIPv6("gggg::1")).toBe(null);
        expect(expandIPv6("1234:5678:9abc:defg::")).toBe(null);
    });
});

describe("Edge cases and special inputs", () => {
    it("should handle IPv6 addresses with mixed case", () => {
        expect(isIPv6("FE80::")).toBe(true);
        expect(isIPv6("fe80::")).toBe(true);
        expect(expandIPv6("FE80::"))
            .toBe("fe80:0000:0000:0000:0000:0000:0000:0000"); // 注意标准化为小写
    });

    it("should handle full IPv6 addresses without abbreviation", () => {
        expect(expandIPv6("2001:0db8:0000:0000:0000:ff00:0042:8329"))
            .toBe("2001:0db8:0000:0000:0000:ff00:0042:8329");
        expect(ipv6ToArpa("2001:0db8:0000:0000:0000:ff00:0042:8329"))
            .toBe("9.2.3.8.2.4.0.0.0.0.f.f.0.0.0.0.0.0.0.0.0.0.0.0.8.b.d.0.1.0.0.2.ip6.arpa");
    });

    it("should handle IPv6 addresses with embedded IPv4", () => {
        expect(isIPv6("::ffff:192.168.1.1")).toBe(false); // 当前实现不支持嵌入式IPv4
    });

    it("should handle invalid inputs gracefully", () => {
        expect(isIPv4("")).toBe(false);
        expect(isIPv6("")).toBe(false);
        expect(() => toArpa("")).toThrow("Invalid IP address");
        expect(() => toArpa(null as any)).toThrow("Invalid IP address");
        expect(() => toArpa(undefined as any)).toThrow("Invalid IP address");
    });
});
