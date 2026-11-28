import { create } from 'zustand';

type State = {
    fileIds: string[];
    add: (fileId: string) => void;
    uploadState: boolean;
    setUploadState: (state: boolean) => void;
    clear: () => void;
};

export const useImageKitUploads = create<State>((set) => ({
    uploadState: false,
    fileIds: [],
    add: (fileId) => set((s) => ({ fileIds: [...s.fileIds, fileId] })),
    setUploadState: (state) =>
        set({
            uploadState: state,
        }),
    clear: () => set({ fileIds: [] }),
}));
