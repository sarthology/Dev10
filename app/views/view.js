let view={};
view.post =`{{#each posts}}
    <div class="post" onclick="openLink('{{link}}')">
        <div class="post-info">
            <div class="author">
                <img src="{{authorImage}}" alt="">
            </div>
            <div>
                <p class="title">{{title}}</p>
                <p class="author-name">{{author}} </p>
            </div>
        </div>
        <div class="action-section">
            <div class="tags">
                {{#each tags}}
                    {{#if backgroundColor}}
                        <div class="tag" style="{{backgroundColor}}{{color}}" onclick="getTag(event,'{{name}}')">
                    {{else}}
                        <div class="tag" onclick="getTag(event,'{{name}}')">
                    {{/if}}
                            <p>{{name}}</p>
                        </div>
                {{/each}}
            </div>
            <div class="save-to-piggy">
                {{#if saved}}
                    <div class="pig-saved" onclick="">
                {{else}}
                    <div class="pig" onclick="savePost(event,'{{@index}}')">
                {{/if}}
                    </div>
            </div>
        </div>
    </div>   
{{/each}}`

view.tag =`{{#each tags}}
    <div class="tag" style="{{backgroundColor}}{{color}}" onclick="getTag(event,'{{name}}')">
        <p>{{name}}</p>
    </div>  
{{/each}}`

view.loader = `<div class="loader">
<img src="../icons/loader-2.gif">
</div>`

view.piggyList= `<div class="piggy-list">
<img src="../icons/pig.png" alt="">
<h2>Your Piggy List</h2>
</div>`
module.exports = view;
