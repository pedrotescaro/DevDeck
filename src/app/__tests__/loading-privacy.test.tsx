import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import PlatformLoading from '@/app/loading';
import FeedLoading from '@/app/feed/loading';

describe.each([
  ['global', PlatformLoading, 'Loading DevDeck', 'site-entry-loader'],
  ['feed protegido', FeedLoading, 'Carregando seu feed...', 'route-loading-screen'],
])('estado de carregamento %s', (_, LoadingComponent, loadingTitle, testId) => {
  it('não revela a interface da plataforma antes da autenticação', () => {
    const { container } = render(<LoadingComponent />);

    expect(screen.getByTestId(testId)).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('status')).toHaveTextContent(loadingTitle);
    expect(screen.queryByText('Carregando o feed')).not.toBeInTheDocument();
    expect(container.querySelector('.dd-platform-shell')).not.toBeInTheDocument();
    expect(container.querySelector('a[href="/feed"]')).not.toBeInTheDocument();
  });
});
