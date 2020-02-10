import * as fs from "fs";
import { write } from "../src/main";

jest.mock('@actions/core');

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

        write('KEY_1', 'value_1', '', envPath);
        write('KEY_2', 'value_2', '', envPath);
    });

    it('should use default if value is empty', async () => {
        expectedFilePath = __dirname + '/results/expected-2.env';

        write('KEY_1', '', 'default_value_1', envPath);
    });

    it('should skip non-nullable keys', async () => {
        expectedFilePath = __dirname + '/results/expected-3.env';

        write('KEY_1', 'value_1', '', envPath, false);
        write('KEY_2', '', '', envPath, false);
        write('KEY_3', '', '', envPath, true);
    });
});
