$(document).ready(function () {
    const DEFAULT_SEARCH = 'javascript'

    let currentPage = 1;
    let totalPages = 0;
    const itemsPerPage = 35;

    if (localStorage.getItem('lastSearch')) {
        let lastSearch = JSON.parse(localStorage.getItem('lastSearch'));
        $('#search-input').val(lastSearch.query);
        currentPage = lastSearch.page;
        searchBooks(lastSearch.query, currentPage);
    } else {
        searchBooks(DEFAULT_SEARCH, currentPage);
    }

    function saveSearchState(query, page) {
        localStorage.setItem('lastSearch', JSON.stringify({ query: query, page: page }));
    }

    function searchBooks(query, page) {
        let offset = (page - 1) * itemsPerPage;
        let startIndex = (page - 1) * itemsPerPage;
        $.ajax({
            url: `https://openlibrary.org/search.json?q=${query}&page=${page}&offset=${offset}&limit=${itemsPerPage}`,
            method: 'GET',
            success: function (data) {
                totalPages = Math.ceil(data.numFound / itemsPerPage);
                displayResults(data.docs);
                displayPagination();
                saveSearchState(query, page);
            },
            error: function () {
                alert('Error fetching data');
            }
        });
    }

    function displayResults(books) {
        let resultsDiv = $('#results');
        resultsDiv.empty();
        if (books.length > 0) {
            books.forEach(book => {
                let bookInfo = `
                    <div class="book">
                        <h3>${book.title}</h3>
                        <p>By ${book.author_name ? book.author_name.join(', ') : 'Unknown author'}</p>
                        <a href="bookDetails.html?isbn=${book.isbn ? book.isbn[0] : ''}">View Details</a>
                    </div>`;
                resultsDiv.append(bookInfo);
            });
        } else {
            resultsDiv.append("<p>No books found</p>");
        }
    }

    function displayPagination() {
        let paginationDiv = $('#pagination');
        paginationDiv.empty();
        for (let i = 1; i <= totalPages; i++) {
            let pageLink = `<button class="page-btn" data-page="${i}">${i}</button>`;
            paginationDiv.append(pageLink);
        }

        $('.page-btn').click(function () {
            currentPage = $(this).data('page');
            let query = $('#search-input').val();
            searchBooks(query, currentPage);
        });
    }

    $('#search-btn').click(function () {
        let query = $('#search-input').val();
        if (query) {
            currentPage = 1;
            searchBooks(query, currentPage);
        } else {
            alert('Please enter a search term');
        }
    });
});
