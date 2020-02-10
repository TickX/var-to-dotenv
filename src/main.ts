import * as core from '@actions/core'
import fs, { PathLike } from "fs";
import dotenv, { DotenvParseOutput } from "dotenv";

export const write = (key: string, value: string, to: PathLike, nullable: boolean) => {
    if (!value && !nullable) {
        core.info(`Skipping '${key}' as it is not nullable but has no value`);
        return;
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

export function run() {
    try {
        const value = core.getInput('value');

        write(
            core.getInput('key'),
            value === '' ? core.getInput('default') : value,
            core.getInput('envPath'),
            core.getInput('nullable') === 'true'
        );
    } catch (error) {
        core.setFailed(error);
    }
}

run();
