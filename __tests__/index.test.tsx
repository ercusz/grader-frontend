import { render, screen } from '@testing-library/react';
import Home from '../pages';

import { useSession } from 'next-auth/react';

jest.mock('next-auth/react');

const mockUseSession = useSession as jest.Mock;

describe('Home', () => {
  it('should render home (unauthenticated)', () => {
    mockUseSession.mockReturnValue({
      status: 'unauthenticated',
      data: null,
    });

    render(<Home />);
    expect(screen.getByRole('heading', { name: /grade้r/ }));
    expect(screen.getByText('“เกรดเด้อ”'));
    expect(screen.queryByText('คลาสเรียนของฉัน')).not.toBeInTheDocument();
    expect(screen.queryByText('เพลย์กราวด์')).not.toBeInTheDocument();
  });

  it('should render home (authenticated)', () => {
    mockUseSession.mockReturnValue({
      status: 'authenticated',
      data: { username: 'admin' },
    });

    render(<Home />);
    expect(screen.getByRole('heading', { name: /grade้r/ }));
    expect(screen.getByText('“เกรดเด้อ”'));
    expect(screen.getByText('คลาสเรียนของฉัน'));
    expect(screen.getByText('เพลย์กราวด์'));
  });
});
