const log = require('./Logger.js');
const Embed = require('discord.js').RichEmbed;

function cut(txt, n) {
    return txt.length <= n ? txt : (txt.substr(0, n - 3) + '...');
}

function replace_nl(txt) {
    return txt.replace(new RegExp('\n', 'g'), ' ');
}

class Command {
    constructor(names) {
        this.names = names;
        this.on_execution(() => {});
        this.hide(false);
        this.set_description("The description has not been setup.");
        this.set_formats(this.names);
        this.set_examples([]);
    }

    is(command) {
        return this.names.some((n) => n === command);
    }

    on_execution(f) {
        this.execution = f;
        return this;
    } 
    
    execute(msg, args, db, app_info) {
        log.detail(1, "Execution...");
        this.current_execution = {
            msg, args, db, app_info
        };
        this.execution(msg, args, db, app_info);
    }

    hide(b) {
        this.hidden = b;
        return this;
    }

    set_description(d) {
        this.description = d;
        return this;
    }

    set_formats(fs) {
        this.formats = fs;
        return this;
    }

    set_examples(es) {
        this.examples = es;
        return this;
    }

    send_error(title, description) {
        title = title || "Unknown error";
        description = description || "Sorry, an internal error occurs";

        var txt_log = cut(`${title}: ${description}`, 80); 
        log.warning(1, `Send Embed >> ${replace_nl(txt_log)}`);

        return this.current_execution.msg.channel.send({ embed: {
            color: 0xff0000,
            title,
            description
        }});
    }

    send_response(title, description, fields) {
        var txt_log = cut(`${title}: ${description}`, 80); 
        log.info(1, `Send Embed >> ${replace_nl(txt_log)}`);

        var e = new Embed()
            .setColor(0x3399ff)
            .setTitle(title)
            .setDescription(description);

        if (fields) {
            for(var i = 0; i < fields.length; ++i) {
                const f = fields[i];
                e.addField(f[0], f[1], f[2]);
            }
        }
        return this.current_execution.msg.channel.send({ embed: e });
    }

    send_message(txt) {
        var txt_log = cut(txt, 80); 
        log.info(1, `Send >> ${replace_nl(txt_log)}`);
        return this.current_execution.msg.channel.send(txt);
    }

    send_files(files) {
        log.info(1, `Send Files >> ${replace_nl(cut(files.join(', '), 80))}`);
        this.current_execution.msg.channel.send({ files });
    }

}

module.exports = {
    Command
};