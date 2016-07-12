<?php

/* index.html */
class __TwigTemplate_3223fb1e698dbbb803059a41cc377b8432518ff995c814d267b36ad0a34ef804 extends Twig_Template
{
    public function __construct(Twig_Environment $env)
    {
        parent::__construct($env);

        $this->parent = false;

        $this->blocks = array(
        );
    }

    protected function doDisplay(array $context, array $blocks = array())
    {
        // line 1
        echo "<!DOCTYPE html>
<html lang=\"en\">
    <head>
        <meta charset=\"utf-8\">
        <title>Hello World!</title>
    </head>
    <body>
        <h1>Hello ";
        // line 8
        echo twig_escape_filter($this->env, (isset($context["name"]) ? $context["name"] : null), "html", null, true);
        echo "!</h1>
    </body>
</html>";
    }

    public function getTemplateName()
    {
        return "index.html";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  28 => 8,  19 => 1,);
    }
}
/* <!DOCTYPE html>*/
/* <html lang="en">*/
/*     <head>*/
/*         <meta charset="utf-8">*/
/*         <title>Hello World!</title>*/
/*     </head>*/
/*     <body>*/
/*         <h1>Hello {{ name }}!</h1>*/
/*     </body>*/
/* </html>*/
