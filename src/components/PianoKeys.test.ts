import { describe, beforeEach, expect, test, vi, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import * as tone from "@/utils/tone";
import PianoKeys from "./PianoKeys.vue";

const startNoteMock = vi.fn();
const endNoteMock = vi.fn();

describe("components/PianoKeys", () => {
  beforeEach(() => {
    vi.spyOn(tone, "useSynthetiser").mockImplementation(() => ({
      startNote: startNoteMock,
      endNote: endNoteMock,
    }));
  });

  afterEach(() => {
    startNoteMock.mockClear();
    endNoteMock.mockClear();
  });

  test("renders", () => {
    const wrapper = mount(PianoKeys);
    expect(wrapper).toBeDefined();
  });
});
