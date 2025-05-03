import React from 'react';
import '../styles/Blog.css';

const blogData = [
  {
    id: 1,
    image: '/img/main-banner.jpg',        // kendi resimlerinle değiştir
    title: 'Lorem ipsum dolor sit amet',
    excerpt:
      'Lorem ipsum dolor sit amet. Sed euismod, urna eu tempor interdum, nisi nisl aliquam magna, quis ultricies nisl urna eu ipsum.',
    date: '10 Nisan 2025',
    category: 'MODA'
  },
  {
    id: 2,
    image: '/img/banner2.jpg',
    title: 'Consectetur adipiscing elit',
    excerpt:
      'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Integer at nulla sed orci dapibus blandit.',
    date: '15 Nisan 2025',
    category: 'KEŞFET'
  }
  // daha fazla post eklersen otomatik artar
];

export default function Blog() {
  return (
    <section className="blog-section">
      <div className="blog-container">
        <header className="blog-header">
          <p className="blog-subtitle">BLOGUMUZ</p>
          <h2 className="blog-title">Our Blog</h2>
        </header>

        <div className="blog-grid">
          {blogData.map(post => (
            <article key={post.id} className="blog-post">
              <div className="blog-image-container">
                <img
                  src={post.image}
                  alt={post.title}
                  className="blog-image"
                />
                <span className="blog-category">{post.category}</span>
              </div>
              <div className="blog-content">
                <h3 className="blog-post-title">{post.title}</h3>
                <p className="blog-excerpt">{post.excerpt}</p>
                <div className="blog-footer">
                  <a href="#" className="blog-read-more">
                    READ MORE
                  </a>
                  <span className="blog-date">{post.date}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
