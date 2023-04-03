import { describe, expect, test, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { render, fireEvent } from "@testing-library/vue";
import { useKeys } from "@/utils/keys";
import PianoKeys from "./PianoKeys.vue";

const keyboardMock = [
  [
    { note: "C", octave: 3 },
    { note: "C#", octave: 3 },
    { note: "D", octave: 3 },
    { note: "D#", octave: 3 },
    { note: "E", octave: 3 },
    { note: "F", octave: 3 },
    { note: "F#", octave: 3 },
    { note: "G", octave: 3 },
    { note: "G#", octave: 3 },
    { note: "A", octave: 3 },
    { note: "A#", octave: 3 },
    { note: "B", octave: 3 },
  ],
  [{ note: "C", octave: 4 }],
];

const isKeyActiveMock = vi.fn();
const playKeyMock = vi.fn();
const stopKeyMock = vi.fn();

const useKeysMock = () => ({
  keyboardLayout: keyboardMock,
  isKeyActive: isKeyActiveMock,
  playKey: playKeyMock,
  stopKey: stopKeyMock,
});

vi.mock("@/utils/keys", () => ({
  useKeys: vi.fn(),
}));

describe("components/PianoKeys", () => {
  beforeEach(() => {
    // @ts-ignore useKeys is mocked because we did it above
    useKeys.mockImplementation(useKeysMock);
  });

  afterEach(() => {
    playKeyMock.mockClear();
    stopKeyMock.mockClear();
    isKeyActiveMock.mockClear();
  });

  test("renders a piano with the keyboard layout provided by useKeys", () => {
    const wrapper = mount(PianoKeys);
    expect(wrapper).toBeDefined();

    const keys = wrapper.findAll(".key");
    expect(keys).toHaveLength(13);
  });

  // It's important to organise your tests so they are readable by other people, and by your future self!
  describe("black keys (using vue-test-utils)", () => {
    test("adds an extra class to black keys", () => {
      const wrapper = mount(PianoKeys);
      expect(wrapper).toBeDefined();

      const keys = wrapper.findAll(".key");

      [1, 3, 6, 8, 10].forEach((i) => {
        expect(keys.at(i)?.classes()).toContain("black");
      });
    });

    test("does not add the class to white keys", () => {
      const wrapper = mount(PianoKeys);
      expect(wrapper).toBeDefined();

      const keys = wrapper.findAll(".key");

      [0, 2, 4, 5, 7, 9, 11, 12].forEach((i) => {
        expect(keys.at(i)?.classes()).not.toContain("black");
      });
    });
  });

  describe("black keys (using testing-library)", () => {
    test("adds an extra class to black keys", () => {
      const { getAllByText } = render(PianoKeys);

      keyboardMock
        .flat()
        .filter((key) => key.note.endsWith("#"))
        .forEach((key) => {
          getAllByText(key.note).forEach((keyElement) => {
            expect(keyElement.getAttribute("class")).toContain("black");
          });
        });
    });

    test("does not add the class to white keys", () => {
      const { getAllByText } = render(PianoKeys);

      keyboardMock
        .flat()
        .filter((key) => !key.note.endsWith("#"))
        .forEach((key) => {
          getAllByText(key.note).forEach((keyElement) => {
            expect(keyElement.getAttribute("class")).not.toContain("black");
          });
        });
    });
  });

  describe("interaction (using vue-test-utils)", () => {
    test("calls playKey when the mouse clicks down on a key", async () => {
      const wrapper = mount(PianoKeys);
      const key = await wrapper.findAll(".key").at(0);
      await key?.trigger("mousedown");
      expect(playKeyMock).toHaveBeenCalledWith("C", 3);
    });

    test("calls stopKey when the mouse is released on a key", async () => {
      const wrapper = mount(PianoKeys);
      const key = await wrapper.findAll(".key").at(6);
      await key?.trigger("mouseup");
      expect(stopKeyMock).toHaveBeenCalledWith("F#", 3);
    });
  });

  describe("interaction (testing library)", () => {
    test("calls playKey when the mouse clicks down on a key", async () => {
      const { getAllByText } = render(PianoKeys);
      const key = await getAllByText("C").at(0);
      await fireEvent.mouseDown(key as HTMLElement);
      expect(playKeyMock).toHaveBeenCalledWith("C", 3);
    });

    test("calls stopKey when the mouse is released on a key", async () => {
      const { getAllByText } = render(PianoKeys);
      const key = await getAllByText("F#").at(0);
      await fireEvent.mouseUp(key as HTMLElement);
      expect(stopKeyMock).toHaveBeenCalledWith("F#", 3);
    });
  });
});
