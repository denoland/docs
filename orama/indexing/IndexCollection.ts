import { IndexStats, OramaDocument } from "../types.ts";

export class IndexCollection {
  public documents: OramaDocument[] = [];

  public addDocument(doc: OramaDocument | null) {
    if (!doc) {
      return;
    }

    this.documents.push(doc);
  }

  public get stats(): IndexStats {
    const documents = this.documents;
    const stats: IndexStats = {
      totalDocuments: documents.length,
      totalCharacters: documents.reduce(
        (sum, doc) => sum + doc.content.length,
        0,
      ),
      averageDocumentLength: 0,
      categoryCounts: {} as Record<string, number>,
      sectionCounts: {} as Record<string, number>,
      documentsWithTags: documents.filter((doc) => doc.tags.length > 0).length,
      documentsWithDescriptions:
        documents.filter((doc) => doc.description).length,
      longestDocument: "",
      shortestDocument: "",
      apiDocuments: 0,
      markdownDocuments: 0,
    };

    stats.averageDocumentLength = Math.round(
      stats.totalCharacters / stats.totalDocuments,
    );

    // Count by category
    documents.forEach((doc) => {
      stats.categoryCounts[doc.category] =
        (stats.categoryCounts[doc.category] || 0) + 1;
      const sectionKey = `${doc.category}/${doc.section}`;
      stats.sectionCounts[sectionKey] = (stats.sectionCounts[sectionKey] || 0) +
        1;
    });

    // Find longest and shortest documents
    let longest = documents[0];
    let shortest = documents[0];
    documents.forEach((doc) => {
      if (doc.content.length > longest.content.length) longest = doc;
      if (doc.content.length < shortest.content.length) shortest = doc;
    });
    stats.longestDocument =
      `${longest.title} (${longest.content.length} chars)`;
    stats.shortestDocument =
      `${shortest.title} (${shortest.content.length} chars)`;

    return stats;
  }
}
