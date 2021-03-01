// this file just provides types for jsdoc comments in .js files

export type OnPatchChange = (bank: number, patch: number) => void

export type OnIdentityReply = () => void

export type OnMidiMessage = (deltaTime: number, message: number[]) => void