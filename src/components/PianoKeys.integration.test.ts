import { describe, beforeEach, expect, test, vi, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { render, fireEvent } from "@testing-library/vue";
import * as tone from "@/utils/tone";
import { notes } from "@/data/notes";
import PianoKeys from "./PianoKeys.vue";

const startNoteMock = vi.fn();
const endNoteMock = vi.fn();

describe("components/PianoKeys", () => {
  beforeEach(() => {
    vi.spyOn(tone, "useSynthetiser").mockImplementation(() => ({
      startNote: startNoteMock,
      endNote: endNoteMock,
    }));

    // NOTE that: "isBlackKey" and "notes" are not mocked. Why? And
    // can we call it a unit test if we're not mocking the dependencies
    // all the way through?
  });

  afterEach(() => {
    startNoteMock.mockClear();
    endNoteMock.mockClear();
  });

  test("renders a piano with three octaves", () => {
    const wrapper = mount(PianoKeys);
    expect(wrapper).toBeDefined();

    const keys = wrapper.findAll(".key");
    expect(keys).toHaveLength(37);
  });

  test("adds the first key in a higher octave at the end", () => {
    const wrapper = mount(PianoKeys);
    expect(wrapper).toBeDefined();

    const keys = wrapper.findAll(".key");
    expect(keys.at(36)?.text()).toEqual(notes[0].toString());
  });

  // It's important to organise your tests so they are readable by other people, and by your future self!
  describe("black keys (using vue-test-utils)", () => {
    test("adds an extra class to black keys", () => {
      const wrapper = mount(PianoKeys);
      expect(wrapper).toBeDefined();

      const keys = wrapper.findAll(".key");

      [1, 3, 6, 8, 10, 13, 15, 18, 20, 22, 25, 27, 30, 32, 34].forEach((i) => {
        expect(keys.at(i)?.classes()).toContain("black");
      });
    });

    test("does not add the class to white keys", () => {
      const wrapper = mount(PianoKeys);
      expect(wrapper).toBeDefined();

      const keys = wrapper.findAll(".key");

      [
        0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19, 21, 23, 24, 26, 28, 29, 31,
        33, 35, 36,
      ].forEach((i) => {
        expect(keys.at(i)?.classes()).not.toContain("black");
      });
    });
  });

  describe("black keys (using testing-library)", () => {
    test("adds an extra class to black keys", () => {
      const { getAllByText } = render(PianoKeys);

      notes
        .filter((note) => note.endsWith("#"))
        .forEach((note) => {
          getAllByText(note).forEach((keyElement) => {
            expect(keyElement.getAttribute("class")).toContain("black");
          });
        });
    });

    test("does not add the class to white keys", () => {
      const { getAllByText } = render(PianoKeys);

      notes
        .filter((note) => !note.endsWith("#"))
        .forEach((note) => {
          getAllByText(note).forEach((keyElement) => {
            expect(keyElement.getAttribute("class")).not.toContain("black");
          });
        });
    });
  });

  describe("interaction (using vue-test-utils)", () => {
    test("calls startNote when the mouse clicks down on a note", async () => {
      const wrapper = mount(PianoKeys);
      const key = await wrapper.findAll(".key").at(0);
      await key?.trigger("mousedown");
      expect(startNoteMock).toHaveBeenCalledWith("C", 4);
    });

    test("calls endNote when the mouse is released on a note", async () => {
      const wrapper = mount(PianoKeys);
      const key = await wrapper.findAll(".key").at(6);
      await key?.trigger("mousedown");
      expect(startNoteMock).toHaveBeenCalledWith("F#", 4);
    });
  });

  describe("interaction (testing library)", () => {
    test("calls startNote when the mouse clicks down on a note", async () => {
      const { getAllByText } = render(PianoKeys);
      const key = await getAllByText("C").at(0);
      await fireEvent.mouseDown(key as HTMLElement);
      expect(startNoteMock).toHaveBeenCalledWith("C", 4);
    });

    test("calls endNote when the mouse is released on a note", async () => {
      const { getAllByText } = render(PianoKeys);
      const key = await getAllByText("F#").at(1);
      await fireEvent.mouseDown(key as HTMLElement);
      expect(startNoteMock).toHaveBeenCalledWith("F#", 5);
    });
  });
});
