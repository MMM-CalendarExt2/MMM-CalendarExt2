const pattern = "^(MMM-CalendarExt2|CX2|fake_module|module-content|[a-z][a-zA-Z0-9]+(_\\d+)?)$";
const config = {
  "extends": ["stylelint-config-standard"],
  "plugins": ["stylelint-prettier"],
  "root": true,
  "rules": {
    "declaration-block-no-redundant-longhand-properties": null,
    "keyframes-name-pattern": pattern,
    "no-descending-specificity": null,
    "prettier/prettier": true,
    "rule-empty-line-before": null,
    "selector-class-pattern": pattern
  }
};

export default config;
