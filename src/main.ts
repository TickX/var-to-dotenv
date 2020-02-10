import * as core from '@actions/core'
import fs, { PathLike } from "fs";
import dotenv, { DotenvParseOutput } from "dotenv";

export const write = (
    key: string,
    value: string,
    defaultValue: string,
    to: PathLike,
    nullable: boolean = true
): void => {
    if (value === '') {
        value = defaultValue;

        if (value === '') {
            if (!nullable) {
                core.info(`Skipping '${key}' as it is not nullable and has no value`);
                return;
            }

            core.info(`Writing empty variable '${key}'`);
        }
    }

    core.setSecret(value);
    core.exportVariable(key, value);

    let content: DotenvParseOutput = {[key]: value};
    if (fs.existsSync(to)) {
        content = {...dotenv.parse(fs.readFileSync(to)), ...content};
    }

    const envVars = Object.entries(content)
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');

    fs.writeFileSync(to, envVars);
};

try {
    write(
        core.getInput('key'),
        core.getInput('value'),
        core.getInput('default'),
        core.getInput('envPath'),
        core.getInput('nullable') === 'true'
    );
} catch (error) {
    core.setFailed(error);
}
