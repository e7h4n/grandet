import { createStore } from "rippling/core";
import { expect, it } from "vitest";
import { navIndex } from "../portfolio";

it('get nav_index', async () => {
    const store = createStore()

    const index = await store.get(navIndex)

    expect(index).toHaveLength(1232)

})