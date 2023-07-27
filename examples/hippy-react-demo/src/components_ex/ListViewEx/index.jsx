import { ListView } from '@hippy/react';

export default class ListViewEx extends ListView {

  render() {
    const result = super.render();
    const copy = {
      ...result,
      props: {
        ...result.props,
        nativeName: 'ListViewEx',
      },
    }
    Object.freeze(copy);
    return copy;
  }
}
