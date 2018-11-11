import { IoComponent, IO } from './io.component';

describe('IoComponent', () => {
  it('raises the pass event when clicked', () => {
    const comp = new IoComponent();
    const data: IO = { id: 42, value: 'Test' };
    comp.data = data;

    comp.pass.subscribe(d => expect(d).toBe(data));
    comp.onClick();
  });
});
