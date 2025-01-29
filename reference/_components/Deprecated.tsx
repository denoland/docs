export default function ({ markdownContent }) {
  if (markdownContent === null) {
    return null;
  }

  return (
    <div class="deprecated">
      <div>
        <span>Deprecated</span>
      </div>

      {/*markdown rendering*/}
      {markdownContent && (
        <div dangerouslySetInnerHTML={{ __html: markdownContent }} />
      )}
    </div>
  );
}
