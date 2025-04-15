export const paginationMarkup = (
  activePage: number,
  totalPages: number
): string => {
  const pageNumbers = () => {
    let startPage = 1;
    let endPage = totalPages;

    if (totalPages > 5) {
      if (activePage <= 3) {
        endPage = 5;
      } else if (activePage >= totalPages - 2) {
        startPage = totalPages - 4;
      } else {
        startPage = activePage - 2;
        endPage = activePage + 2;
      }
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const prevPage = activePage === 1 ? false : activePage - 1;
  const nextPage = activePage === totalPages ? false : activePage + 1;
  const spriteUrl = "/static/sprite.svg";

  return `
    <button
      ${!prevPage ? "disabled" : ""}
      class="pagination-control"
      type="button"
      data-page="${prevPage}"
      aria-label="Previous page"
      title="Previous page"
    >
      <svg width="20" height="20">
        <use href="${spriteUrl}#icon-chevron-left" />
      </svg>
      <span>Previous</span>
    </button>
    <ul class="pagination-pages">
      ${pageNumbers()
        .map(
          (page) =>
            `<li><button ${page === activePage ? "disabled" : ""} 
              class="pagination-pages-item" type="button" data-page=${page} aria-label="Page ${page}" ${
              page === activePage ? "aria-current='true'" : ""
            } title="Page ${page}">${page}</button></li>`
        )
        .join("")}
        </ul>
      <button
        ${!nextPage ? "disabled" : ""}
        class="pagination-control"
        type="button"
        data-page=${nextPage}
        aria-label="Next page"
        title="Next page"
      >
        <span>Next</span>
        <svg width="20" height="20">
          <use href="${spriteUrl}#icon-chevron-right" />
        </svg>
      </button>`;
};
