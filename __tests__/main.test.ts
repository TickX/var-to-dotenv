jest.mock('@actions/core');

import * as fs from "fs";
import { write } from "../src/main";

describe('Action run', () => {
    const envPath = __dirname + '/.env';

    let expectedFilePath: string;

    beforeEach(() => {
        if (fs.existsSync(envPath)) {
            fs.unlinkSync(envPath);
        }
    });

    afterEach(() => {
        const expected = fs.readFileSync(expectedFilePath);
        const actual = fs.readFileSync(envPath);

        expect(expected.equals(actual)).toBe(true);
    });

    it('should write variables to env', () => {
        expectedFilePath = __dirname + '/results/expected.env';

        write({
            key: 'KEY_1',
            value: 'value_1',
            defaultValue: '',
            filePath: envPath,
            isNullable: false
        });

        write({
            key: 'KEY_2',
            value: 'value_2',
            defaultValue: '',
            filePath: envPath,
            isNullable: false
        });
    });

    it('should use default if value is empty', async () => {
        expectedFilePath = __dirname + '/results/expected-2.env';

        write({
            key: 'KEY_1',
            value: '',
            defaultValue: 'default_value_1',
            filePath: envPath,
            isNullable: false
        });
    });

    it('should skip non-nullable keys', async () => {
        expectedFilePath = __dirname + '/results/expected-3.env';

        write({
            key: 'KEY_1',
            value: 'value_1',
            defaultValue: '',
            filePath: envPath,
            isNullable: false
        });

        write({
            key: 'KEY_2',
            value: '',
            defaultValue: '',
            filePath: envPath,
            isNullable: false
        });

        write({
            key: 'KEY_3',
            value: '',
            defaultValue: '',
            filePath: envPath,
            isNullable: true
        });
    });

    it('should add quotes around value containing space(s)', async () => {
        expectedFilePath = __dirname + '/results/expected-4.env';

        write({
            key: 'KEY_1',
            value: 'value with spaces',
            defaultValue: 'default_value_1',
            filePath: envPath,
            isNullable: false
        });
    });
});
