export class NullIndexer implements IIndexDocuments {
    public isValidIndexer(file: InputFileReference): boolean {
        return true;
    }

    public async tryIndex(file: InputFileReference): Promise<OramaDocument | null> {        
        console.log("No valid indexer found for file:", file.fullPath);
        return null;
    }
}
