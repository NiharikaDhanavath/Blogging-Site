// Firebase Configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",                      // Replace with your Firebase API key
    authDomain: "YOUR_AUTH_DOMAIN",              // Replace with your Firebase Auth domain
    projectId: "YOUR_PROJECT_ID",                // Replace with your Firebase project ID
    storageBucket: "YOUR_STORAGE_BUCKET",        // Replace with your Firebase storage bucket
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // Replace with your Firebase messaging sender ID
    appId: "YOUR_APP_ID"                         // Replace with your Firebase app ID
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get references to HTML elements
const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('error-message');
const homeSection = document.getElementById('home-section');
const loginSection = document.getElementById('login-section');
const blogPostsContainer = document.getElementById('blog-posts-container');

// Handle login submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;

    try {
        // Firebase Authentication - Sign In
        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
        console.log('User logged in:', userCredential.user);

        // After successful login, show the blog posts and hide the login section
        loginSection.style.display = 'none';
        homeSection.style.display = 'block';

        // Fetch blog posts from Firestore
        fetchBlogPosts();

    } catch (error) {
        console.error('Error logging in:', error.message);
        errorMessage.textContent = error.message;
    }
});

// Fetch blog posts from Firestore
const fetchBlogPosts = async () => {
    const db = firebase.firestore();
    try {
        const postsSnapshot = await db.collection('blogPosts').get();
        const posts = postsSnapshot.docs.map(doc => doc.data());

        // Clear previous posts
        blogPostsContainer.innerHTML = '';

        // Display blog posts
        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.classList.add('blog-post');
            postElement.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.content}</p>
            `;
            blogPostsContainer.appendChild(postElement);
        });

    } catch (error) {
        console.error('Error fetching blog posts:', error.message);
    }
};

// Firebase Authentication State Change Listener
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // If the user is already logged in, show the blog posts
        loginSection.style.display = 'none';
        homeSection.style.display = 'block';
        fetchBlogPosts();
    } else {
        // If no user is logged in, show the login form
        loginSection.style.display = 'block';
        homeSection.style.display = 'none';
    }
});

