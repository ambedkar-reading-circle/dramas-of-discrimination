// Shared split-section contract: two start-aligned columns (1.1fr / 1fr)
// separated by the notebook gutter, collapsing to one column with row gaps
// below the md breakpoint. One source so the three sections cannot drift.
export const splitSectionClasses =
  'notebook-section page-wrap grid grid-cols-[1.1fr_1fr] items-start gap-gutter max-md:grid-cols-1 max-md:gap-row'
