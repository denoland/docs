import {
    IIndexDocuments,
    InputFileReference,
    OramaDocument,
} from "../types.ts";

export class NullIndexer implements IIndexDocuments {
    public isValidIndexer(_file: InputFileReference): boolean {
        return true;
    }

    public tryIndex(file: InputFileReference): Promise<OramaDocument | null> {
        console.log("No valid indexer found for file:", file.fullPath);
        return Promise.resolve(null);
    }
}
