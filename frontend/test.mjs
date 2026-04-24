import { blogPosts } from './src/data/blogData.js';
console.log('Successfully imported', blogPosts.length, 'posts.');
try {
  blogPosts.forEach(p => {
    if(!p) throw new Error('Null post');
    if(!p.slug) throw new Error('Missing slug in post ID ' + p.id);
  });
  console.log('All posts valid');
} catch (e) {
  console.error('Error in posts:', e);
}
