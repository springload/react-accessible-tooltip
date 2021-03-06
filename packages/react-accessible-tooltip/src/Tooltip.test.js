// @flow

import classnames from 'classnames';
import toJson from 'enzyme-to-json';
import { mount } from 'enzyme';

// $FlowFixMe
import React16 from 'react-16';
// $FlowFixMe
import React15 from 'react-15';

import { type LabelProps, type OverlayProps } from './';

function testReact(React, Tooltip) {
    const HIDDEN_CLASS = 'HIDDEN_CLASS';
    const LABEL_CLASS = 'LABEL_CLASS';
    const OVERLAY_CLASS = 'OVERLAY_CLASS';

    const Label = ({ isHidden, labelAttributes }: LabelProps) => (
        <div
            className={classnames(LABEL_CLASS, {
                [HIDDEN_CLASS]: isHidden,
            })}
            {...labelAttributes}
        />
    );

    const Overlay = ({ isHidden, overlayAttributes }: OverlayProps) => (
        <div
            className={classnames(OVERLAY_CLASS, {
                [HIDDEN_CLASS]: isHidden,
            })}
            {...overlayAttributes}
        >
            Hello world
        </div>
    );

    let wrapper;
    let label;
    let overlay;
    let overlayDiv;

    function isOverlayHidden() {
        return (
            wrapper
                .find(Overlay)
                .find('div')
                .instance()
                .getAttribute('aria-hidden') === 'true'
        );
    }

    beforeEach(() => {
        wrapper = mount(<Tooltip label={Label} overlay={Overlay} />);

        label = wrapper.find(Label);
        overlay = wrapper.find(Overlay);
        overlayDiv = wrapper.find(`.${OVERLAY_CLASS}`).instance();
    });

    afterEach(() => {
        wrapper.unmount();
    });

    describe(`${React.version} -`, () => {
        it('matches the previous snapshot', () => {
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it("increments the overlay's `id` attribute with each instance.", () => {
            expect(overlay.find('div').prop('id')).toEqual(
                'react-accessible-tooltip-1', // as opposed to `react-accessible-tooltip-0`
            );
        });

        it('hides the overlay by default', () => {
            expect(isOverlayHidden()).toBeTruthy();
        });

        it('reveals the overlay when the label is focussed', () => {
            expect(isOverlayHidden()).toBeTruthy();
            label.simulate('focus');
            expect(isOverlayHidden()).toBeFalsy();
        });

        it('hides the overlay when the whole tooltip is blurred (and focus changes to a non-recognisable target)', () => {
            expect(isOverlayHidden()).toBeTruthy();
            label.simulate('focus');
            expect(isOverlayHidden()).toBeFalsy();
            label.simulate('blur', { relatedTarget: 'notAnElement' });
            expect(isOverlayHidden()).toBeTruthy();
        });

        it("hides the overlay when focus shifts and there's no support for event.relatedTarget", () => {
            expect(isOverlayHidden()).toBeTruthy();
            label.simulate('focus');
            expect(isOverlayHidden()).toBeFalsy();
            label.simulate('blur');
            expect(isOverlayHidden()).toBeTruthy();
        });

        it('hides the overlay when focus shifts to a target outside the tooltip', () => {
            expect(isOverlayHidden()).toBeTruthy();
            label.simulate('focus');
            expect(isOverlayHidden()).toBeFalsy();
            label.simulate('blur', { relatedTarget: document.body });
            expect(isOverlayHidden()).toBeTruthy();
        });

        it("doesn't hide the overlay when focus shifts to the tooltip overlay", () => {
            expect(isOverlayHidden()).toBeTruthy();
            label.simulate('focus');
            expect(isOverlayHidden()).toBeFalsy();
            label.simulate('blur', { relatedTarget: overlay.getDOMNode() });
            expect(isOverlayHidden()).toBeFalsy();
        });

        describe('hover functionality', () => {
            it('opens on mouseEnter and closes on mouseLeave', () => {
                expect(isOverlayHidden()).toBeTruthy();
                wrapper
                    .find('div')
                    .first()
                    .simulate('mouseEnter');
                expect(isOverlayHidden()).toBeFalsy();

                wrapper
                    .find('div')
                    .first()
                    .simulate('mouseLeave');
                expect(isOverlayHidden()).toBeTruthy();
            });
        });

        describe('touch devices -', () => {
            it('opens on focus', () => {
                expect(isOverlayHidden()).toBeTruthy();
                label.simulate('focus');
                expect(isOverlayHidden()).toBeFalsy();
            });

            it('closes on touch-away', () => {
                label.simulate('focus');
                expect(isOverlayHidden()).toBeFalsy();
                const testEvent = new Event('touchstart', { bubbles: true });
                // $FlowFixMe
                document.body.dispatchEvent(testEvent);
                expect(isOverlayHidden()).toBeTruthy();
            });

            it("doesn't close when descendant element touched", () => {
                label.simulate('focus');
                expect(isOverlayHidden()).toBeFalsy();
                const testEvent = new Event('touchstart', { bubbles: true });
                // $FlowFixMe;
                overlayDiv.dispatchEvent(testEvent);
                expect(isOverlayHidden()).toBeFalsy();
            });

            it('successfully unmounts without crashing', () => {
                wrapper.unmount();
            });

            it('removes touch event listeners on unmount', () => {
                const removeEventListenerSpy = jest.spyOn(
                    document,
                    'removeEventListener',
                );
                wrapper.unmount();
                expect(removeEventListenerSpy).toHaveBeenCalled();
                removeEventListenerSpy.mockReset();
                removeEventListenerSpy.mockRestore();
            });

            it('contains matching "aria-describedby" and "id" attributes', () => {
                const id = wrapper
                    .find('[aria-describedby]')
                    .prop('aria-describedby');
                expect(wrapper.find(`#${id}`).exists()).toBe(true);
            });
        });
    });
}

describe('<Tooltip />', () => {
    describe('React 16', () => {
        jest.resetModules();
        jest.doMock('react', () => React16);
        // eslint-disable-next-line global-require
        const { Tooltip } = require('./');
        testReact(React16, Tooltip);
    });

    describe('React 15', () => {
        jest.resetModules();
        jest.doMock('react', () => React15);
        // eslint-disable-next-line global-require
        const { Tooltip } = require('./');
        testReact(React15, Tooltip);
    });
});
