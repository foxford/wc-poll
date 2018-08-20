## Usage

### Define module

#### ES
```html
<script type="module">
  import { Poll } from '@netology-group/wc-poll/es/poll.js';
  window.customElements.define('wc-poll', Poll);
</script>
```

#### UMD
```html
<script src="pathto/dist/polyfill.js"></script>
<script src="pathto/dist/index.js"></script>
<script src="pathto/dist/poll.js"></script>
<script>
  window.onload = function(){
    var withStyleLink = window.WC.withStyleLink
    var withPoll = window.WCPoll.mixins.withPoll

    window.customElements.define(
      'wc-poll', 
      withStyleLink(
        withPoll(
          window.WC.Poll, 
          { 
            text: 'question?', 
            total: 0, 
            list:[{
              label: 'Answer',
              name: 'answer',
              value: 'Answer',
              count: 0,
            }]
          }
        ),
        'pathto/dist/poll.css'
      )
    )
  }
</script>
```

### In HTML

### Generic usage
```html
<wc-poll></wc-poll>
```

## How to

### Demo
```sh
npm start
# generic version: http://127.0.0.1:9090
# embedded version: http://127.0.0.1:9090/embedded.html
```

### Run for development
```sh
npm run build -- --w
```

### Build for production
```sh
NODE_ENV=production npm run build
```

