import { describe, it, expect } from "vitest";
import { parseMentions } from "../mentions";
import React from "react";

describe("parseMentions", () => {
  it("should split and parse mentions in text", () => {
    const elements = parseMentions("Hello @pedrodev how are you?");
    expect(elements).toHaveLength(3);
    expect(elements[0]).toBe("Hello ");
    expect(React.isValidElement(elements[1])).toBe(true);
    expect((elements[1] as any).props.children).toBe("@pedrodev");
    expect((elements[1] as any).props.href).toBe("/profile/pedrodev");
    expect(elements[2]).toBe(" how are you?");
  });

  it("should support underscores in usernames", () => {
    const elements = parseMentions("Hello @pedro_dev!");
    expect(elements).toHaveLength(3);
    expect((elements[1] as any).props.children).toBe("@pedro_dev");
  });

  it("should not match email addresses", () => {
    const elements = parseMentions("contact us at support@devdeck.dev for help");
    expect(elements).toHaveLength(1);
    expect(elements[0]).toBe("contact us at support@devdeck.dev for help");
  });

  it("should match multiple mentions", () => {
    const elements = parseMentions("@user1 and @user2");
    expect(elements).toHaveLength(5);
    expect((elements[1] as any).props.children).toBe("@user1");
    expect((elements[3] as any).props.children).toBe("@user2");
  });
});
