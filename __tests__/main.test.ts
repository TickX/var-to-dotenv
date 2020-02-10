import * as core from '@actions/core'
import fs from "fs";
import * as sinon from "sinon";

jest.mock('@actions/core');

const action = require('../src/main');

describe('Action run', () => {
    beforeEach(() => {
        sinon.restore();
    });

    it('should fail if write failed', () => {
        const error = new Error('wtf');
        sinon.stub(action, 'write').throws(error);

        action.run();

        expect(core.setFailed).toHaveBeenCalledWith(error);
    });
});

describe('Action run', () => {
    const envPath = __dirname + '/.env';

    let expectedFilePath: string;

    beforeEach(() => {
        if (fs.existsSync(envPath)) {
            fs.unlinkSync(envPath);
        }

        sinon.restore();
    });

    afterEach(() => {
        const expected = fs.readFileSync(expectedFilePath);
        const actual = fs.readFileSync(envPath);

        expect(expected.equals(actual)).toBe(true);
    });

    it('should write variables to env', () => {
        expectedFilePath = __dirname + '/results/expected.env';

        sinon.stub(core, 'getInput')
            .withArgs('envPath').returns(envPath)
            .withArgs('key')
            .onFirstCall().returns('KEY_1')
            .onSecondCall().returns('KEY_2')
            .withArgs('value')
            .onFirstCall().returns('value_1')
            .onSecondCall().returns('value_2');

        action.run();
        action.run();
    });

    it('should use default if value is empty', async () => {
        expectedFilePath = __dirname + '/results/expected-2.env';

        sinon.stub(core, 'getInput')
            .withArgs('envPath').returns(envPath)
            .withArgs('key').returns('KEY_1')
            .withArgs('value').returns('')
            .withArgs('default').returns('default_value_1');

        action.run();
    });
});
