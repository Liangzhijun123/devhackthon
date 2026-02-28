/**
 * Unit tests for UpgradePrompt component
 * 
 * Tests:
 * - Component renders correctly
 * - Displays locked features
 * - Shows CTA button linking to pricing page
 * - Displays pricing information
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { UpgradePrompt } from '../UpgradePrompt';

describe('UpgradePrompt', () => {
  it('renders the upgrade prompt with heading', () => {
    render(<UpgradePrompt />);
    
    expect(screen.getByText('Unlock Premium Features')).toBeInTheDocument();
    expect(screen.getByText(/Upgrade to Premium or Pro/)).toBeInTheDocument();
  });

  it('displays all locked features', () => {
    render(<UpgradePrompt />);
    
    // Check for locked features
    expect(screen.getByText('Unlimited Interviews')).toBeInTheDocument();
    expect(screen.getByText('Practice as much as you want')).toBeInTheDocument();
    
    expect(screen.getByText('Performance Analytics')).toBeInTheDocument();
    expect(screen.getByText('Track your progress over time')).toBeInTheDocument();
    
    expect(screen.getByText('Full Session History')).toBeInTheDocument();
    expect(screen.getByText('Access all your past sessions')).toBeInTheDocument();
    
    expect(screen.getByText('30+ Questions')).toBeInTheDocument();
    expect(screen.getByText('Double your practice variety')).toBeInTheDocument();
  });

  it('displays CTA button linking to pricing page', () => {
    render(<UpgradePrompt />);
    
    const ctaButton = screen.getByRole('link', { name: /View Pricing Plans/i });
    expect(ctaButton).toBeInTheDocument();
    expect(ctaButton).toHaveAttribute('href', '/pricing');
  });

  it('displays pricing information', () => {
    render(<UpgradePrompt />);
    
    expect(screen.getByText('Starting at just $9/month')).toBeInTheDocument();
  });

  it('displays lock icons for each feature', () => {
    const { container } = render(<UpgradePrompt />);
    
    // Check that lock icons are present (SVG elements)
    const lockIcons = container.querySelectorAll('svg path[clip-rule="evenodd"]');
    expect(lockIcons.length).toBeGreaterThan(0);
  });

  it('has gradient styling for visual appeal', () => {
    const { container } = render(<UpgradePrompt />);
    
    // Check for gradient classes
    const gradientElements = container.querySelectorAll('[class*="gradient"]');
    expect(gradientElements.length).toBeGreaterThan(0);
  });
});
