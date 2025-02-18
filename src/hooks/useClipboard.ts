
import Clipboard from 'vue-clipboard3';

export function useClipboard() {
    const { toClipboard } = Clipboard();
    async function copy(content: string) {
        try {
            await toClipboard(content);
        } catch(err:any) {
            throw Error(err.message)
        }
    }

    return {
        copy
    }
}