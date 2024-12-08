import { $computed, $effect, $value } from "rippling";
import Corbado from '@corbado/web-js';

const reloadAtom = $value(0)
const corbadoAtom = $computed(async (get) => {
    get(reloadAtom)

    return await Corbado.load({
        projectId: "pro-8910668211600497001",
    }).then(() => Corbado)
})

export const showAuthPageEffect = $effect(async (get, set, elem: HTMLDivElement, signal: AbortSignal) => {
    const corbado = await get(corbadoAtom)
    corbado.mountAuthUI(elem, {
        onLoggedIn: () => {
            set(onAuthEffect)
        }
    })

    signal.addEventListener("abort", () => {
        corbado.unmountAuthUI(elem)
    })
})

export const userAtom = $computed(async (get) => {
    const corbado = await get(corbadoAtom)
    return corbado.user
})

export const authedAtom = $computed(async (get) => !!(await get(userAtom)))

export const onAuthEffect = $effect((_, set) => {
    set(reloadAtom, x => x + 1)
})

export const logoutEffect = $effect(async (get, set) => {
    const corbado = await get(corbadoAtom)
    await corbado.logout()
    set(reloadAtom, x => x + 1)
})

export const sessionTokenAtom = $computed(async (get) => {
    const corbado = await get(corbadoAtom)
    return corbado.sessionToken
})

export const sessionHeadersAtom = $computed(async (get) => {
    const token = await get(sessionTokenAtom)
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${token}`);
    return headers
})
