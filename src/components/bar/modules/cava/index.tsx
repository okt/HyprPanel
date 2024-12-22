import options from 'src/options';
import { Module } from '../../shared/Module';
import { inputHandler } from 'src/components/bar/utils/helpers';
import { BarBoxChild } from 'src/lib/types/bar';
import { bind, Variable } from 'astal';
import { Astal } from 'astal/gtk3';
import Cava from 'gi://AstalCava';

const { length, glyphs, leftClick, rightClick, middleClick, scrollUp, scrollDown } = options.bar.customModules.cava;

export const CavaWidget = (): BarBoxChild => {
    const cava = Cava.get_default();
    const barLength = bind(length);
    cava?.set_bars(barLength.get());
    // cava?.set_bars(16);

    const bars = Variable('');
    // const blocks = ['⣀', '⣄', '⣆', '⣇', '⣧', '⣷', '⣿'];
    const blocks = bind(glyphs);

    cava?.connect('notify::values', () => {
        const values = cava.get_values();
        let b = values.map((val) => blocks.get()[Math.min(Math.floor(val * 8), blocks.get().length - 1)]).join('');

        bars.set(b.trim()); // Trim just in case
    });

    const cavaModule = Module({
        boxClass: 'cava-custom',
        label: bind(bars),
        props: {
            setup: (self: Astal.Button) => {
                inputHandler(self, {
                    onPrimaryClick: {
                        cmd: leftClick,
                    },
                    onSecondaryClick: {
                        cmd: rightClick,
                    },
                    onMiddleClick: {
                        cmd: middleClick,
                    },
                    onScrollUp: {
                        cmd: scrollUp,
                    },
                    onScrollDown: {
                        cmd: scrollDown,
                    },
                });
            },
            onDestroy: () => {
                cava?.disconnect;
            },
        },
    });

    return cavaModule;
};
