$(document).ready(function () {
    let params = new URLSearchParams(window.location.search);
    let isbn = params.get('isbn');

    if (isbn) {
        $.ajax({
            url: `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`,
            method: 'GET',
            success: function (data) {
                let bookData = data[`ISBN:${isbn}`];
                if (bookData) {
                    displayBookDetails(bookData);
                } else {
                    $('#book-details').append("<p>Book details not available</p>");
                }
            },
            error: function () {
                alert('Error fetching book details');
            }
        });
    }

    function displayBookDetails(book) {
        let bookDetailsDiv = $('#book-details');
        let bookInfo = `
            <h2>${book.title}</h2>
            <p><strong>Authors:</strong> ${book.authors ? book.authors.map(a => a.name).join(', ') : 'Unknown author'}</p>
            <p><strong>Publisher:</strong> ${book.publishers ? book.publishers.map(p => p.name).join(', ') : 'Unknown publisher'}</p>
            <p><strong>Published Date:</strong> ${book.publish_date || 'Unknown date'}</p>
            <p><strong>Description:</strong> ${book.excerpts ? book.excerpts[0].text : 'No description available'}</p>
            <img src="${book.cover ? book.cover.large : ''}" alt="Book cover">
        `;
        bookDetailsDiv.append(bookInfo);
    }
});
