export function toArpa(ip: string): string {
    if (isIPv4(ip)) {
        return ipv4ToArpa(ip);
    } else if (isIPv6(ip)) {
        return ipv6ToArpa(ip);
    } else {
        throw new Error("Invalid IP address");
    }
}

export function isIPv4(ip: string): boolean {
    if (typeof ip !== "string") return false;
    const parts = ip.split(".");
    return (
        parts.length === 4 &&
        parts.every(part => {
            const num = Number(part);
            return !isNaN(num) && num >= 0 && num <= 255 && /^\d+$/.test(part);
        })
    );
}

export function isIPv6(ip: string): boolean {
    if (typeof ip !== "string") return false;
    const parts = ip.split(":");
    if (parts.length > 8) return false;
    
    if (ip.match(/:{3,}/) !== null) return false;

    const doubleColonCount = ip.split("::").length - 1;
    if (doubleColonCount > 1) return false;
    if (doubleColonCount == 0) {
        return parts.length == 8;
    }

    return parts.every(part => part === "" || /^[0-9a-fA-F]{1,4}$/.test(part));
}


export function ipv4ToArpa(ip: string): string {
    if (!isIPv4(ip)) {
        throw new Error("Invalid IPv4 address");
    }
    const parts = ip.split(".");
    return parts.reverse().join(".") + ".in-addr.arpa";
}


export function ipv6ToArpa(ip: string): string {
    if (!isIPv6(ip)) {
        throw new Error("Invalid IPv6 address");
    }
    const expanded = expandIPv6(ip);
    if (!expanded) {
        throw new Error("Invalid IPv6 address");
    }
    const nibbles = expanded.replace(/:/g, "").split("").reverse();
    return nibbles.join(".") + ".ip6.arpa";
}


export function expandIPv6(ip: string): string | null {
    if (!isIPv6(ip)) return null;

    const parts = ip.split("::");
    if (parts.length > 2) return null;

    const left = parts[0] ? parts[0].split(":") : [];
    const right = parts.length === 2 ? parts[1].split(":") : [];
    const fill = new Array(8 - left.length - right.length).fill("0");
    const full = [...left, ...fill, ...right].map(part => part.padStart(4, "0"));

    return full.length === 8 ? full.join(":").toLowerCase() : null;
}

