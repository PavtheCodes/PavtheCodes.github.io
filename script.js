document.addEventListener('DOMContentLoaded', function() {
    const createArticleBtn = document.getElementById('createArticleBtn');
    const viewArticlesBtn = document.getElementById('viewArticlesBtn');
    const createArticleModal = document.getElementById('createArticleModal');
    const cancelArticleBtn = document.getElementById('cancelArticleBtn');
    const articleForm = document.getElementById('articleForm');
    const articlesContainer = document.getElementById('articlesContainer');
    const mainArticle = document.getElementById('mainarticle');

    let articles = JSON.parse(localStorage.getItem('articles')) || [];

    if (articles.length === 0) {
        articles = [
            {
                id: Date.now(),
                title: "Tragic Train Collisions in Greece",
                content: "A series of devastating train crashes has shocked the nation, raising urgent questions about railway safety and infrastructure. Here's what we know so far. In recent months, Greece has been shaken by a series of devastating train collisions that have left the country in mourning and sparked widespread outrage.",
                image: "./images/tempi.jpg",
                date: new Date().toISOString(),
                likes: 0,
                dislikes: 0,
                comments: []
            }
        ];
        localStorage.setItem('articles', JSON.stringify(articles));
    }

    function saveArticles() {
        localStorage.setItem('articles', JSON.stringify(articles));
    }

    function showToast(message, isSuccess = true) {
        Toastify({
            text: message,
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            backgroundColor: isSuccess ? "#4CAF50" : "#F44336",
        }).showToast();
    }

function deleteArticle(id) {
    id = typeof id === 'string' ? parseInt(id) : id;
    const initialLength = articles.length;
    articles = articles.filter(article => article.id !== id);
    
    if (articles.length === initialLength) {
        console.error('No article found with ID:', id);
        showToast('Article not found!', false);
        return;
    }
    
    saveArticles();
    renderArticles();
    showToast('Article deleted successfully!');

    if (articles.length === 0 && mainArticle) {
        mainArticle.style.display = 'block';
    }
}

const backToMainBtn = document.getElementById('backToMainBtn'); // OUT OF ORDER

function renderArticles() {
    articlesContainer.innerHTML = '';

    hideMainArticle();

    if (articles.length === 0) {
        articlesContainer.innerHTML += '<p class="text-gray-500">No articles yet. Create one!</p>';
        return;
    }

    articlesContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-btn')) {
            const articleId = e.target.getAttribute('data-id');
            deleteArticle(articleId);
        }
    });

    articles.forEach(article => {
        const content = article.content || 'No content available';
        const truncatedContent = content.length > 60 
            ? content.substring(0, 60) + '...' 
            : content;

        const articleDate = new Date(article.date).toLocaleDateString();

        const articleElement = document.createElement('div');
        articleElement.className = 'bg-white p-6 rounded-lg shadow-lg';
        articleElement.innerHTML = `
            <h2 class="text-2xl font-bold mb-2">${article.title || 'Untitled Article'}</h2>
            <p class="text-gray-500 text-sm mb-2">${articleDate}</p>
            <p class="mb-4">${truncatedContent}</p>
            ${article.image ? `<img src="${article.image}" class="w-full h-auto mb-4">` : ''}
            <div class="flex justify-between items-center">
                <a href="article.html?id=${article.id}" class="text-blue-600 hover:underline">Read more</a>
                <button data-id="${article.id}" class="delete-btn px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
            </div>
        `;
        articlesContainer.appendChild(articleElement);
    });
}

function showMainArticle() {
    const articlesContainer = document.getElementById('articlesContainer');
    const mainArticle = document.getElementById('mainarticle');

    if (articlesContainer && mainArticle) {
        articlesContainer.innerHTML = '';
        articlesContainer.appendChild(mainArticle);
        mainArticle.style.display = 'block';
    }
}


function hideMainArticle() {
    if (mainArticle) mainArticle.style.display = 'none';
}
viewArticlesBtn.addEventListener('click', function() {
    renderArticles();
    hideMainArticle();
});
showMainArticle();

    function deleteArticle(id) {
    id = typeof id === 'string' ? parseInt(id, 10) : id;
    
    console.log('Deleting article with ID:', id, 'Type:', typeof id);
    console.log('Current articles before deletion:', articles);

    const initialLength = articles.length;
    articles = articles.filter(article => {
        const articleId = typeof article.id === 'string' ? parseInt(article.id, 10) : article.id;
        return articleId !== id;
    });

    if (articles.length === initialLength) {
        console.error('No article found with ID:', id);
        showToast('Article not found!', false);
        return;
    }

    saveArticles();
    renderArticles();
    showToast('Article deleted successfully!');
    
    if (articles.length === 0 && mainArticle) {
        mainArticle.style.display = 'block';
    }
}
    function createArticle(title, content, imageUrl) {
        const newArticle = {
            id: Date.now(),
            title: title || 'Untitled Article',
            content: content || '',
            image: imageUrl || null,
            date: new Date().toISOString(),
            likes: 0,
            dislikes: 0,
            comments: []
        };
        
        articles.unshift(newArticle);
        saveArticles();
        renderArticles();
        showToast('Article created successfully!');
    }

    createArticleBtn.addEventListener('click', () => {
        createArticleModal.classList.remove('hidden');
    });

    cancelArticleBtn.addEventListener('click', () => {
        createArticleModal.classList.add('hidden');
        articleForm.reset();
    });

    articleForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('articleTitle').value;
        const content = document.getElementById('articleContent').value;
        const imageUrl = document.getElementById('articleImage').value;
        
        if (!title || !content) {
            showToast('Title and content are required!', false);
            return;
        }
        
        createArticle(title, content, imageUrl);
        createArticleModal.classList.add('hidden');
        articleForm.reset();
    });

    viewArticlesBtn.addEventListener('click', () => {
        renderArticles();
    });

    if (mainArticle) mainArticle.style.display = 'block';
});