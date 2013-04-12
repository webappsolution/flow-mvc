/*
Jesse, can you create a logger that wraps the Ext Logger but outputs a format like:

15:52:41:130 DEBUG [FlowMVC.mvc.event.AbstractEvent] - AbstractEvent.Constructor: type = flowMVCEvent 

thinking the following:
1) easy way to use like log4j with timestamp syntax
2) easy config that pulls in class it's using as part of the log msg -- can probably just reuse the stuff I have our Logger.getLogge() method now.
3) ability to add json vars to tokens; eg 

logger.debug("execute: first = {0}, last = {1}", [first, last]);

OR 

logger.debug("execute: first = {first}, last = {last}", { "first":first, "last":last });
*/

/*
msg: The message to log (required).
level: One of: "error", "warn", "info" or "log" (the default is "log").
dump: An object to dump to the log as part of the message.
stack: True to include a stack trace in the log.
indent: Cause subsequent log statements to be indented one step.
outdent: Cause this and following statements to be one step less indented.
*/

Ext.define("FlowMVC.logger.Logger2",
{

  internalLog: function(level, args)
  {
    // [jwarden 4.8.2013] TODO: verify multiple args, works in log4javascript
    // var indent = false;

    // Ext.log({level: level, msg: args, dump: dumpObj});
    // if(args && args.length > 0)
    // {
    //   indent = true;
    // }
    switch(level)
    {
      case "log":
      case "debug":
        try{console.debug.apply(console, args);}catch(e){}
        break;
      case "info":
        try{console.info.apply(console, args);}catch(e){}
        break;
      case "warn":
        try{console.warn.apply(console, args);}catch(e){}
        break;
      case "error":
      case "fatal":
        try{console.error.apply(console, args);}catch(e){}
        break;
    }
    
  },

  log: function()
  {
    this.internalLog("log", arguments);
  },

  debug: function()
  {
    this.internalLog("debug", arguments);
  },

  info: function()
  {
    this.internalLog("info", arguments);
  },

  warn: function()
  {
     this.internalLog("warn", arguments);
  },

  error: function()
  {
    this.internalLog("error", arguments);
  },

  fatal: function()
  {
    this.internalLog("fatal", arguments);
  }

});

