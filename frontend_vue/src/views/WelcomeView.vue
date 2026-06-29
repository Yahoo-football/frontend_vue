<template>
  <section class="hero panel">
    <div class="hero-copy">
      <p class="eyebrow">Customer storefront</p>
      <h1 class="page-title">Discover products, add to cart, and checkout in a modern Vue shop.</h1>
      <p class="hero-text">
        This frontend connects directly to your Laravel Sanctum API for customers only.
        Admin still lives in Laravel Blade, exactly as your architecture requires.
      </p>
      <div class="hero-actions">
        <RouterLink class="btn btn-primary" to="/login">Customer Login</RouterLink>
        <RouterLink class="btn btn-secondary" to="/register">Create Account</RouterLink>
        <a class="btn btn-ghost" href="http://localhost:8000/login">Admin Login</a>
      </div>
    </div>

    <div class="hero-card">
      <div class="mini-card">
        <span class="mini-label">Featured</span>
        <strong>Fresh deals every day</strong>
        <p class="muted">Clean product cards, cart flow, and order history.</p>
      </div>
      <div class="mini-grid">
        <div class="mini-tile">
          <span>Cart</span>
          <strong>Fast</strong>
        </div>
        <div class="mini-tile">
          <span>Checkout</span>
          <strong>Simple</strong>
        </div>
        <div class="mini-tile">
          <span>Orders</span>
          <strong>Tracked</strong>
        </div>
      </div>
    </div>
  </section>
</template>
