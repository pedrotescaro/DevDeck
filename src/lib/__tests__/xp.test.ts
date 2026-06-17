import { describe, it, expect, vi, beforeEach } from "vitest";
import { calculateLevel, awardXP } from "../xp";
import { prisma } from "@/lib/prisma";

vi.mock("@/lib/prisma", () => {
  const mockPrisma = {
    user: {
      update: vi.fn(),
    },
    languageTrail: {
      findUnique: vi.fn(),
      update: vi.fn(),
      create: vi.fn(),
    },
    userBadge: {
      create: vi.fn(),
      findMany: vi.fn(() => []),
    },
    badge: {
      findUnique: vi.fn(),
    },
    answer: {
      count: vi.fn(() => 0),
    },
    quizAttempt: {
      count: vi.fn(() => 0),
    },
    $transaction: vi.fn((callback) => callback(mockPrisma)),
  };
  return { prisma: mockPrisma };
});

describe("calculateLevel", () => {
  it("should calculate correct level thresholds", () => {
    expect(calculateLevel(100)).toEqual({ level: 1, nextLevelXp: 500, prevLevelXp: 0 });
    expect(calculateLevel(600)).toEqual({ level: 2, nextLevelXp: 800, prevLevelXp: 500 });
    expect(calculateLevel(2500)).toEqual({ level: 6, nextLevelXp: 2600, prevLevelXp: 2000 });
  });
});

describe("awardXP", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should award general XP (without language) correctly", async () => {
    const updatedUserMock = { id: "user-1", total_xp: 100 };
    vi.mocked(prisma.user.update).mockResolvedValue(updatedUserMock);

    const result = await awardXP("user-1", null, 100);

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: "user-1" },
      data: { total_xp: { increment: 100 } },
    });
    expect(result.newXp).toBe(100);
    expect(result.newLevel).toBe(1);
    expect(result.language).toBeNull();
  });

  it("should award language trail XP correctly", async () => {
    const updatedUserMock = { id: "user-1", total_xp: 250 };
    const trailMock = null; // simulate creating new trail

    vi.mocked(prisma.user.update).mockResolvedValue(updatedUserMock);
    vi.mocked(prisma.languageTrail.findUnique).mockResolvedValue(trailMock);
    vi.mocked(prisma.languageTrail.create).mockResolvedValue({
      id: "trail-1",
      xp: 150,
      level: 1,
      streak: 1,
    } as any);

    const result = await awardXP("user-1", "TS", 150);

    expect(prisma.languageTrail.create).toHaveBeenCalled();
    expect(result.xpEarned).toBe(150);
    expect(result.newStreak).toBe(1);
  });
});
