-- MySQL dump 10.13  Distrib 8.0.42, for macos13.7 (arm64)
--
-- Host: localhost    Database: f8_api
-- ------------------------------------------------------
-- Server version	9.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `__EFMigrationsHistory`
--

DROP TABLE IF EXISTS `__EFMigrationsHistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `__EFMigrationsHistory` (
  `MigrationId` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ProductVersion` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`MigrationId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `__EFMigrationsHistory`
--

LOCK TABLES `__EFMigrationsHistory` WRITE;
/*!40000 ALTER TABLE `__EFMigrationsHistory` DISABLE KEYS */;
INSERT INTO `__EFMigrationsHistory` VALUES ('20250421101241_InitCreate2','8.0.10'),('20250421101404_InitCreate2','8.0.10');
/*!40000 ALTER TABLE `__EFMigrationsHistory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lessontype`
--

DROP TABLE IF EXISTS `lessontype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lessontype` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lessontype`
--

LOCK TABLES `lessontype` WRITE;
/*!40000 ALTER TABLE `lessontype` DISABLE KEYS */;
INSERT INTO `lessontype` VALUES (1,'Bài giảng'),(2,'Câu hỏi về Code'),(3,'Câu hỏi trắc nghiệm'),(4,'Thông tin');
/*!40000 ALTER TABLE `lessontype` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `level`
--

DROP TABLE IF EXISTS `level`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `level` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `level`
--

LOCK TABLES `level` WRITE;
/*!40000 ALTER TABLE `level` DISABLE KEYS */;
INSERT INTO `level` VALUES (1,'Kiến thức cơ bản',NULL,NULL),(2,'Kiến thức nâng cao',NULL,NULL);
/*!40000 ALTER TABLE `level` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblblogger`
--

DROP TABLE IF EXISTS `tblblogger`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tblblogger` (
  `id` int NOT NULL AUTO_INCREMENT,
  `content` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `isActive` tinyint(1) DEFAULT '0',
  `blog_type_id` int NOT NULL,
  `banner` varchar(100) DEFAULT NULL,
  `UserId` int DEFAULT NULL,
  `title` text,
  `countView` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `tblBlogger_tblBlogType_FK` (`blog_type_id`),
  KEY `tblBlogger_tblUser_FK` (`UserId`),
  CONSTRAINT `tblBlogger_tblBlogType_FK` FOREIGN KEY (`blog_type_id`) REFERENCES `tblblogtype` (`id`),
  CONSTRAINT `tblBlogger_tblUser_FK` FOREIGN KEY (`UserId`) REFERENCES `tbluser` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblblogger`
--

LOCK TABLES `tblblogger` WRITE;
/*!40000 ALTER TABLE `tblblogger` DISABLE KEYS */;
INSERT INTO `tblblogger` VALUES (5,'# Markdown: Syntax\r\n\r\n*   [Overview](#overview)\r\n    *   [Philosophy](#philosophy)\r\n    *   [Inline HTML](#html)\r\n    *   [Automatic Escaping for Special Characters](#autoescape)\r\n*   [Block Elements](#block)\r\n    *   [Paragraphs and Line Breaks](#p)\r\n    *   [Headers](#header)\r\n    *   [Blockquotes](#blockquote)\r\n    *   [Lists](#list)\r\n    *   [Code Blocks](#precode)\r\n    *   [Horizontal Rules](#hr)\r\n*   [Span Elements](#span)\r\n    *   [Links](#link)\r\n    *   [Emphasis](#em)\r\n    *   [Code](#code)\r\n    *   [Images](#img)\r\n*   [Miscellaneous](#misc)\r\n    *   [Backslash Escapes](#backslash)\r\n    *   [Automatic Links](#autolink)\r\n\r\n\r\n**Note:** This document is itself written using Markdown; you\r\ncan [see the source for it by adding \'.text\' to the URL](/projects/markdown/syntax.text).\r\n\r\n----\r\n\r\n## Overview\r\n\r\n### Philosophy\r\n\r\nMarkdown is intended to be as easy-to-read and easy-to-write as is feasible.\r\n\r\nReadability, however, is emphasized above all else. A Markdown-formatted\r\ndocument should be publishable as-is, as plain text, without looking\r\nlike it\'s been marked up with tags or formatting instructions. While\r\nMarkdown\'s syntax has been influenced by several existing text-to-HTML\r\nfilters -- including [Setext](http://docutils.sourceforge.net/mirror/setext.html), [atx](http://www.aaronsw.com/2002/atx/), [Textile](http://textism.com/tools/textile/), [reStructuredText](http://docutils.sourceforge.net/rst.html),\r\n[Grutatext](http://www.triptico.com/software/grutatxt.html), and [EtText](http://ettext.taint.org/doc/) -- the single biggest source of\r\ninspiration for Markdown\'s syntax is the format of plain text email.\r\n\r\n## Block Elements\r\n\r\n### Paragraphs and Line Breaks\r\n\r\nA paragraph is simply one or more consecutive lines of text, separated\r\nby one or more blank lines. (A blank line is any line that looks like a\r\nblank line -- a line containing nothing but spaces or tabs is considered\r\nblank.) Normal paragraphs should not be indented with spaces or tabs.\r\n\r\nThe implication of the \"one or more consecutive lines of text\" rule is\r\nthat Markdown supports \"hard-wrapped\" text paragraphs. This differs\r\nsignificantly from most other text-to-HTML formatters (including Movable\r\nType\'s \"Convert Line Breaks\" option) which translate every line break\r\ncharacter in a paragraph into a `<br />` tag.\r\n\r\nWhen you *do* want to insert a `<br />` break tag using Markdown, you\r\nend a line with two or more spaces, then type return.\r\n\r\n### Headers\r\n\r\nMarkdown supports two styles of headers, [Setext] [1] and [atx] [2].\r\n\r\nOptionally, you may \"close\" atx-style headers. This is purely\r\ncosmetic -- you can use this if you think it looks better. The\r\nclosing hashes don\'t even need to match the number of hashes\r\nused to open the header. (The number of opening hashes\r\ndetermines the header level.)\r\n\r\n\r\n### Blockquotes\r\n\r\nMarkdown uses email-style `>` characters for blockquoting. If you\'re\r\nfamiliar with quoting passages of text in an email message, then you\r\nknow how to create a blockquote in Markdown. It looks best if you hard\r\nwrap the text and put a `>` before every line:\r\n\r\n> This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet,\r\n> consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus.\r\n> Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.\r\n> \r\n> Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse\r\n> id sem consectetuer libero luctus adipiscing.\r\n\r\nMarkdown allows you to be lazy and only put the `>` before the first\r\nline of a hard-wrapped paragraph:\r\n\r\n> This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet,\r\nconsectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus.\r\nVestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.\r\n\r\n> Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse\r\nid sem consectetuer libero luctus adipiscing.\r\n\r\nBlockquotes can be nested (i.e. a blockquote-in-a-blockquote) by\r\nadding additional levels of `>`:\r\n\r\n> This is the first level of quoting.\r\n>\r\n> > This is nested blockquote.\r\n>\r\n> Back to the first level.\r\n\r\nBlockquotes can contain other Markdown elements, including headers, lists,\r\nand code blocks:\r\n\r\n> ## This is a header.\r\n> \r\n> 1.   This is the first list item.\r\n> 2.   This is the second list item.\r\n> \r\n> Here\'s some example code:\r\n> \r\n>     return shell_exec(\"echo $input | $markdown_script\");\r\n\r\nAny decent text editor should make email-style quoting easy. For\r\nexample, with BBEdit, you can make a selection and choose Increase\r\nQuote Level from the Text menu.\r\n\r\n\r\n### Lists\r\n\r\nMarkdown supports ordered (numbered) and unordered (bulleted) lists.\r\n\r\nUnordered lists use asterisks, pluses, and hyphens -- interchangably\r\n-- as list markers:\r\n\r\n*   Red\r\n*   Green\r\n*   Blue\r\n\r\nis equivalent to:\r\n\r\n+   Red\r\n+   Green\r\n+   Blue\r\n\r\nand:\r\n\r\n-   Red\r\n-   Green\r\n-   Blue\r\n\r\nOrdered lists use numbers followed by periods:\r\n\r\n1.  Bird\r\n2.  McHale\r\n3.  Parish\r\n\r\nIt\'s important to note that the actual numbers you use to mark the\r\nlist have no effect on the HTML output Markdown produces. The HTML\r\nMarkdown produces from the above list is:\r\n\r\nIf you instead wrote the list in Markdown like this:\r\n\r\n1.  Bird\r\n1.  McHale\r\n1.  Parish\r\n\r\nor even:\r\n\r\n3. Bird\r\n1. McHale\r\n8. Parish\r\n\r\nyou\'d get the exact same HTML output. The point is, if you want to,\r\nyou can use ordinal numbers in your ordered Markdown lists, so that\r\nthe numbers in your source match the numbers in your published HTML.\r\nBut if you want to be lazy, you don\'t have to.\r\n\r\nTo make lists look nice, you can wrap items with hanging indents:\r\n\r\n*   Lorem ipsum dolor sit amet, consectetuer adipiscing elit.\r\n    Aliquam hendrerit mi posuere lectus. Vestibulum enim wisi,\r\n    viverra nec, fringilla in, laoreet vitae, risus.\r\n*   Donec sit amet nisl. Aliquam semper ipsum sit amet velit.\r\n    Suspendisse id sem consectetuer libero luctus adipiscing.\r\n\r\nBut if you want to be lazy, you don\'t have to:\r\n\r\n*   Lorem ipsum dolor sit amet, consectetuer adipiscing elit.\r\nAliquam hendrerit mi posuere lectus. Vestibulum enim wisi,\r\nviverra nec, fringilla in, laoreet vitae, risus.\r\n*   Donec sit amet nisl. Aliquam semper ipsum sit amet velit.\r\nSuspendisse id sem consectetuer libero luctus adipiscing.\r\n\r\nList items may consist of multiple paragraphs. Each subsequent\r\nparagraph in a list item must be indented by either 4 spaces\r\nor one tab:\r\n\r\n1.  This is a list item with two paragraphs. Lorem ipsum dolor\r\n    sit amet, consectetuer adipiscing elit. Aliquam hendrerit\r\n    mi posuere lectus.\r\n\r\n    Vestibulum enim wisi, viverra nec, fringilla in, laoreet\r\n    vitae, risus. Donec sit amet nisl. Aliquam semper ipsum\r\n    sit amet velit.\r\n\r\n2.  Suspendisse id sem consectetuer libero luctus adipiscing.\r\n\r\nIt looks nice if you indent every line of the subsequent\r\nparagraphs, but here again, Markdown will allow you to be\r\nlazy:\r\n\r\n*   This is a list item with two paragraphs.\r\n\r\n    This is the second paragraph in the list item. You\'re\r\nonly required to indent the first line. Lorem ipsum dolor\r\nsit amet, consectetuer adipiscing elit.\r\n\r\n*   Another item in the same list.\r\n\r\nTo put a blockquote within a list item, the blockquote\'s `>`\r\ndelimiters need to be indented:\r\n\r\n*   A list item with a blockquote:\r\n\r\n    > This is a blockquote\r\n    > inside a list item.\r\n\r\nTo put a code block within a list item, the code block needs\r\nto be indented *twice* -- 8 spaces or two tabs:\r\n\r\n*   A list item with a code block:\r\n\r\n        <code goes here>\r\n\r\n### Code Blocks\r\n\r\nPre-formatted code blocks are used for writing about programming or\r\nmarkup source code. Rather than forming normal paragraphs, the lines\r\nof a code block are interpreted literally. Markdown wraps a code block\r\nin both `<pre>` and `<code>` tags.\r\n\r\nTo produce a code block in Markdown, simply indent every line of the\r\nblock by at least 4 spaces or 1 tab.\r\n\r\nThis is a normal paragraph:\r\n\r\n    This is a code block.\r\n\r\nHere is an example of AppleScript:\r\n\r\n    tell application \"Foo\"\r\n        beep\r\n    end tell\r\n\r\nA code block continues until it reaches a line that is not indented\r\n(or the end of the article).\r\n\r\nWithin a code block, ampersands (`&`) and angle brackets (`<` and `>`)\r\nare automatically converted into HTML entities. This makes it very\r\neasy to include example HTML source code using Markdown -- just paste\r\nit and indent it, and Markdown will handle the hassle of encoding the\r\nampersands and angle brackets. For example, this:\r\n\r\n    <div class=\"footer\">\r\n        &copy; 2004 Foo Corporation\r\n    </div>\r\n\r\nRegular Markdown syntax is not processed within code blocks. E.g.,\r\nasterisks are just literal asterisks within a code block. This means\r\nit\'s also easy to use Markdown to write about Markdown\'s own syntax.\r\n\r\n```\r\ntell application \"Foo\"\r\n    beep\r\nend tell\r\n```\r\n\r\n## Span Elements\r\n\r\n### Links\r\n\r\nMarkdown supports two style of links: *inline* and *reference*.\r\n\r\nIn both styles, the link text is delimited by [square brackets].\r\n\r\nTo create an inline link, use a set of regular parentheses immediately\r\nafter the link text\'s closing square bracket. Inside the parentheses,\r\nput the URL where you want the link to point, along with an *optional*\r\ntitle for the link, surrounded in quotes. For example:\r\n\r\nThis is [an example](http://example.com/) inline link.\r\n\r\n[This link](http://example.net/) has no title attribute.\r\n\r\n### Emphasis\r\n\r\nMarkdown treats asterisks (`*`) and underscores (`_`) as indicators of\r\nemphasis. Text wrapped with one `*` or `_` will be wrapped with an\r\nHTML `<em>` tag; double `*`\'s or `_`\'s will be wrapped with an HTML\r\n`<strong>` tag. E.g., this input:\r\n\r\n*single asterisks*\r\n\r\n_single underscores_\r\n\r\n**double asterisks**\r\n\r\n__double underscores__\r\n\r\n### Code\r\n\r\nTo indicate a span of code, wrap it with backtick quotes (`` ` ``).\r\nUnlike a pre-formatted code block, a code span indicates code within a\r\nnormal paragraph. For example:\r\n\r\nUse the `printf()` function.','2024-11-23 20:01:23','2025-06-05 01:36:33',1,1,'/uploads/blogger/banner/z6042757190445_63f84f8ef1f0c5b6b64e338eac8c4ce5.jpg',36,'Hello Xin chào',10),(6,'<p><strong>Tình yêu</strong>&nbsp;là cảm xúc mà mỗi con người đều có, nhưng có nhiều người vẫn chưa nhận định đúng về loại tình cảm này và nhầm lẫn hay có những suy nghĩ chưa đúng. Hôm nay cùng mình tìm hiểu về định nghĩa tình yêu là gì nhé. Xem ngay bài viết bên dưới nào.</p><h2>1. Tình yêu là gì?</h2><p>Tình yêu là một&nbsp;<strong>loạt cảm xúc&nbsp;</strong>hay các&nbsp;<strong>trạng thái tâm lý</strong>&nbsp;khác nhau. Tất cả cảm xúc trên bộc phát từ tình cảm&nbsp;<strong>chân thành</strong>&nbsp;của một cá nhân và&nbsp;<strong>niềm hạnh phúc</strong>,&nbsp;<strong>vui sướng</strong>&nbsp;của con người. Nó là luôn gắn liền nhu cầu&nbsp;<strong>muốn có được</strong>, sự&nbsp;<strong>ràng buộc&nbsp;</strong>và giúp cho cả hai người trở thành một.</p><p><a href=\"https://didongviet.vn/dchannel/wp-content/uploads/2023/02/tinh-yeu-didongviet5.jpg\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: rgb(190, 30, 45); background-color: transparent;\"><img src=\"https://didongviet.vn/dchannel/wp-content/uploads/2023/02/tinh-yeu-didongviet5.jpg\"></a><em>Mối quan hệ yêu đương</em></p><h2>2. Khái niệm của trên tình bạn, dưới tình yêu</h2><p>Giới trẻ bây giờ ngoài các mối quan hệ rõ ràng như tình bạn,… thì còn xuất hiện thêm những mối quan hệ mới lạ có thể kể đến như khái niệm trên tình bạn dưới tình yêu. Đây là cảm xúc<strong>&nbsp;lưng chừng</strong>&nbsp;giữa 2 người bạn&nbsp;<strong>cảm mến&nbsp;</strong>nhau nhưng không quá sâu đậm. Những bạn trẻ nghĩ rằng đây là mối quan hệ không tồn tại cụm từ “<strong>chia tay</strong>” và họ không muốn đánh đổi tình bạn hiện tại đến tiến tới một mối quan hệ đã biết trước kết quả.</p><p><a href=\"about:blank\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: rgb(190, 30, 45); background-color: transparent;\"><img src=\"https://didongviet.vn/dchannel/wp-content/uploads/2023/02/tinh-yeu-didongviet6.jpg\"></a><em>Khái niệm của trên tình bạn, dưới tình yêu</em></p><h2>3. Ex trong tình yêu là gì?</h2><p>Trong tiếng anh, Ex là một tiền tố. Nó được ghép với các danh từ khác nhau để chỉ những điều hay một thứ gì đó đã qua, hoặc một đối tượng trong quá khứ.</p><p>Mượn hình ảnh đó, đối với mối quan hệ yêu đương cũng sử dụng từ Ex để diễn tả những đối tượng cũ trong các mối quan hệ, ví dụ như&nbsp;<strong>Ex-lover</strong>&nbsp;chỉ người yêu cũ,&nbsp;<strong>Ex-wife</strong>&nbsp;là vợ cũ và&nbsp;<strong>Ex-husband</strong>&nbsp;là chồng cũ,… Người ta sử dụng các cụm từ trên để nhắc về các mối quan hệ tình cảm trong quá khứ nhưng không may đã&nbsp;<strong>tan vỡ</strong>.</p><p><a href=\"about:blank\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: rgb(190, 30, 45); background-color: transparent;\"><img src=\"https://didongviet.vn/dchannel/wp-content/uploads/2023/02/tinh-yeu-didongviet7.jpg\"></a><em>Ex là gì</em></p><h2>4. Cảm xúc khi yêu là gì?</h2><p>Khi yêu, con người ta sẽ tồn tại những cảm xúc cơ bản bao gồm:&nbsp;<strong>vui</strong>,&nbsp;<strong>buồn</strong>,&nbsp;<strong>sợ</strong>,&nbsp;<strong>chán</strong>,&nbsp;<strong>giận</strong>,&nbsp;<strong>ngạc nhiên</strong>,&nbsp;<strong>hy vọng</strong>&nbsp;và&nbsp;<strong>tin tưởng</strong>. Đó cũng chỉ là những cảm giác giữa người với người.&nbsp;</p><p>Từ những&nbsp;<a href=\"https://vi.wikipedia.org/wiki/C%E1%BA%A3m_x%C3%BAc\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: rgb(190, 30, 45); background-color: transparent;\">cảm xúc</a>&nbsp;cơ bản trên, chúng ta chia làm 2 loại:<strong>&nbsp;tích cực</strong>&nbsp;và&nbsp;<strong>tiêu cực</strong>. Tình cảm yêu nhau giữa 2 con người sẽ đem đến sự tích cực cho bạn, khiến bạn hi vọng, chờ đợi người ấy, nhận thấy niềm vui khi gặp gỡ họ, tin tưởng hoàn toàn vào đối phương mặc dù cả 2 không cam kết điều gì với nhau.</p><p>Nhưng có đôi lúc, nó sẽ mang đến sự tiêu cực không như mong muốn, nó sẽ kéo bạn xuống hoặc khiến bạn hoàn toàn&nbsp;<strong>sụp đổ</strong>&nbsp;và&nbsp;<strong>tuyệt vọng</strong>.</p><p><a href=\"about:blank\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: rgb(190, 30, 45); background-color: transparent;\"><img src=\"https://didongviet.vn/dchannel/wp-content/uploads/2023/02/tinh-yeu-didongviet8.jpg\"></a><em>Có nhiều loại cảm xúc trong tình yêu</em></p><h2>5. Ghen trong tình yêu là gì?</h2><p>Ghen được xem là một&nbsp;<strong>gia vị</strong>&nbsp;không thể thiếu của bất kì mối quan hệ yêu đương nào. Cảm xúc khi ghen sẽ giúp tăng sự&nbsp;<strong>thăng hoa</strong>&nbsp;trong mối quan hệ này. Tuy nhiên nếu bạn nêm quá nhiều loại gia vị này thì món ăn của bạn sẽ<strong>&nbsp;hỏng</strong>&nbsp;và không ai có thể thưởng thức được.</p><p>Trong mối quan hệ yêu đương cũng thế, bạn nên suy xét để thể hiện cảm xúc ghen của mình&nbsp;<strong>đúng lúc</strong>,&nbsp;<strong>đúng nơi&nbsp;</strong>và một cách&nbsp;<strong>vừa phải</strong>&nbsp;để nhận được các&nbsp;<strong>phản ánh tích cực</strong>&nbsp;từ người yêu. Đừng để&nbsp;<strong>quá trớn</strong>&nbsp;nó sẽ mang đến sự&nbsp;<strong>muộn phiền</strong>&nbsp;và những&nbsp;<strong>phản hồi tiêu cực</strong>&nbsp;từ đối phương.</p><p><a href=\"about:blank\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: rgb(190, 30, 45); background-color: transparent;\"><img src=\"https://didongviet.vn/dchannel/wp-content/uploads/2023/02/tinh-yeu-didongviet9.jpg\"></a><em>Ghen trong tình yêu</em></p><h2>6. Cảm giác an toàn trong tình yêu là gì?</h2><p>Cảm giác an toàn có thể hiểu là sự&nbsp;<strong>tin tưởng tuyệt đối</strong>&nbsp;của bạn dành cho đối phương và ngược lại. Cả 2 sẽ không có thái độ nghi ngờ và luôn đặt trọn sự tin tưởng và những cảm xúc tích cực đối với bất cứ vấn đề nào xảy ra xung quanh người yêu của bạn.&nbsp;</p><p>Nếu trong mối quan hệ đó, bạn không cảm thấy an toàn hoặc không đem lại cảm giác an toàn cho đối phương thì chắc chắn mối quan hệ đó không thể đi đến kết quả tốt đẹp cuối cùng. Nếu tình trạng đó xảy ra, có thể khiến bạn lẫn đối phương cảm thấy&nbsp;<strong>ngạt thở</strong>,&nbsp;<strong>bất lực</strong>&nbsp;và<strong>&nbsp;dần chán nản</strong>.</p><p><a href=\"about:blank\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: rgb(190, 30, 45); background-color: transparent;\"><img src=\"https://didongviet.vn/dchannel/wp-content/uploads/2023/02/tinh-yeu-didongviet12.jpg\"></a><em>Cảm giác an toàn</em></p><h2>7. Trân trọng tình yêu là gì?</h2><p>Khái niệm này có thể hiểu là bạn dành tất cả những gì tốt đẹp cho người yêu của mình. Đó là trân trọng và tận hưởng tất cả những khoảng thời gian ở cạnh nhau thay vì làm những công việc riêng của bản thân. Biểu hiện không thể thiếu của sự trân trọng chính là&nbsp;<strong>lời xin lỗi&nbsp;</strong>và&nbsp;<strong>cảm ơn</strong>.</p><p><a href=\"about:blank\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: rgb(190, 30, 45); background-color: transparent;\"><img src=\"https://didongviet.vn/dchannel/wp-content/uploads/2023/02/tinh-yeu-didongviet11.jpg\"></a><em>Trân trọng</em></p><h2>8. Nóc nhà là gì trong tình yêu?</h2><p>Cụm từ này khá phổ biến trong các mối quan hệ của giới trẻ hiện nay, nó được bạn nam dùng để chỉ người con gái hoặc người vợ của mình. Đây là một cách nói đùa, qua cụm từ nóc nhà nhằm khẳng định&nbsp;<strong>vị thế to lớn</strong>&nbsp;của người con gái trong mối quan hệ đó. Là cách nói vui nhưng cũng phần nào thể hiện được&nbsp;<strong>sự tôn trọng&nbsp;</strong>của người con trai đối với người yêu mình.</p><p><a href=\"about:blank\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: rgb(190, 30, 45); background-color: transparent;\"><img src=\"https://didongviet.vn/dchannel/wp-content/uploads/2023/02/tinh-yeu-didongviet10.jpg\"></a><em>Nóc nhà là gì</em></p><h2>9. Thương hại trong tình yêu là gì?</h2><p>Khi cả 2 không còn tình cảm với nhau, không còn đồng điệu về mặt cảm xúc mà chi ở lại vì trách nhiệm của bản thân thì đó gọi là thương hại trong tình yêu. Nói rõ hơn là một người đã không còn tình cảm nhưng không đành lòng rời đi nên chọn cách ở lại.</p><p><a href=\"about:blank\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: rgb(190, 30, 45); background-color: transparent;\"><img src=\"https://didongviet.vn/dchannel/wp-content/uploads/2023/02/tinh-yeu-didongviet13.jpg\"></a><em>Thương hại</em></p><h2>10. Hạnh phúc trong tình yêu là gì?</h2><p>Tình yêu chỉ đạt được hạnh phúc&nbsp;<strong>khi yêu&nbsp;</strong>và&nbsp;<strong>được yêu.</strong>&nbsp;Vậy cụ thể hạnh phúc trong mối quan hệ này là gì? Có phải lúc nào bạn cũng cảm nhận được xúc cảm hạnh phúc hay không?</p><p>Hạnh phúc là khi hai trái tim đơn lẻ trở nên&nbsp;<strong>đồng điệu</strong>,&nbsp;<strong>thấu hiểu&nbsp;</strong>và&nbsp;<strong>lắng nghe</strong>&nbsp;những chia sẻ từ nhau. Là khi bạn đặt niềm tin tưởng vào người ấy tuyệt đối và cảm thấy bản thân được tôn trọng.</p><p><a href=\"about:blank\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: rgb(190, 30, 45); background-color: transparent;\"><img src=\"https://didongviet.vn/dchannel/wp-content/uploads/2023/02/tinh-yeu-didongviet14.jpg\"></a><em>Hạnh phúc</em></p><h2>11. Hợp nhau trong tình yêu là gì?</h2><p>Khi bạn chọn lựa quen một người rất hiếm khi bạn và người đó về các mặt như tình cách, gu ăn mặc hay cách cư xử. Chỉ là khi yêu con người ta cố gắng dung hòa với nhau, cố gắng thay đổi để hòa hợp với nhau. Cụm từ hòa hợp trong tình yêu thật ra là bạn có cùng sở thích và thoải mái&nbsp;<strong>chia sẻ&nbsp;</strong>quan điểm của mình cho họ nghe và hơn hết họ là mảnh ghép cho những&nbsp;<strong>thiếu sót</strong>&nbsp;và&nbsp;<strong>khuyết điểm&nbsp;</strong>của bạn.</p><p><a href=\"about:blank\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: rgb(190, 30, 45); background-color: transparent;\"><img src=\"https://didongviet.vn/dchannel/wp-content/uploads/2023/02/tinh-yeu-didongviet15.jpg\"></a><em>Hòa hợp</em></p><h2>12. Tổng hợp 30 định nghĩa hay nhất về tình yêu hiện tại&nbsp;</h2><p>Tiếp theo đây, mình sẽ nêu ra những định nghĩa nổi tiếng về mối quan hệ yêu đương này.</p><blockquote><em>Khi yêu bạn sẽ bao dung, dễ tha thứ cho người mình yêu. Đồng thời nguyện chăm sóc cho người ấy mà không cần được đáp lại. Mặt khác, nếu như bạn yêu mù quáng, dại dột và đặt niềm tin không đúng chỗ sẽ có khả năng bị hủy hoại.</em></blockquote><blockquote><em>Tình yêu. Chúng ta nghĩ về nó, hát về nó, mơ về nó, mất ngủ để lo lắng về nó. Khi chúng ta không có nó, chúng ta luôn muốn tìm kiếm nó. Khi chúng ta khám phá ra nó, chúng ta không biết phải làm gì tiếp theo với nó và khi chúng ta có nó, chúng ta lại sợ mất nó.</em></blockquote><blockquote><em>Tình yêu nên tránh nếu có thể.</em></blockquote><blockquote><em>Annony</em></blockquote><blockquote><em>Tình yêu làm cho bạn dễ bị tổn thương bởi ai đó, trong khi bạn biết họ hoàn toàn có thể phản bội bạn.</em></blockquote><blockquote><em>Sooz_The_Great</em></blockquote><blockquote><em>Tình yêu là vô điều kiện. Khi bạn yêu, bạn làm mọi thứ để người yêu hạnh phúc. Bởi vì bạn thật sự mong muốn những điều tốt đẹp nhất đến với họ.</em></blockquote><blockquote><em>Livelovelaughsurf</em></blockquote><blockquote><em>Tình yêu là một từ ngắn, dễ đánh vần, khó định nghĩa và không thể sống thiếu.</em></blockquote><blockquote><em>Sayshainar.</em></blockquote><blockquote><em>Tình yêu là một từ được sử dụng bởi nhiều người, nhưng được hiểu bởi rất ít người.</em></blockquote><blockquote><em>Reback</em></blockquote><blockquote><em>Tình yêu là một loại tình cảm không vu lợi, không có giới hạn hay điều kiện. Đó là khi bạn tin tưởng người khác bằng cả cuộc sống của mình và sẵn sàng làm bất cứ điều gì cho họ.</em></blockquote><blockquote><em>Tình yêu là một căn bệnh nan y phổ biến, được biết là sẽ ảnh hưởng nhiều đến tâm trí và đôi khi là cơ thể. Các triệu chứng có thể bao gồm: Ảnh hưởng đến phán đoán, chóng mặt, chảy nước mắt, đau ngực và mong muốn mãnh liệt được ở bên cạnh người đã truyền bệnh cho bạn. Được biết đến là rất dễ lây lan và có thể gây tử vong.</em></blockquote><blockquote><em>MorganHammond</em></blockquote><blockquote><em>Tình yêu là một cảm giác mà chúng ta không thể giải thích được nhưng nó vô cùng mạnh mẽ dành cho một ai đó.</em></blockquote><blockquote><em>Tình yêu là một cảm giác dành cho một người khác, rất thuần khiết và thiêng liêng đến nổi không ai thật sự có thể định nghĩa nó một cách chính xác. Đó là những gì một người cảm nhận về người khác và không có bất kỳ rào cản nào cả về vật chất lẫn tinh thần. Họ sống hoàn toàn để ở bên cạnh người đó, để chia sẻ kinh nghiệm, niềm vui, nổi đâu.</em></blockquote><blockquote><em>Zeddeh</em></blockquote><blockquote><em>Tình yêu là một cái gì rất thiêng liêng và mạnh mẽ. Đừng lạm dụng nó.</em></blockquote><blockquote><em>Poop.</em></blockquote><blockquote><em>Tình yêu là một cái gì đó, nếu được đáp lại, sẽ khiến bạn trở thành người hạnh phúc nhất trên thế giới, và không có cái gì khác quan trọng bằng. Tuy nhiên, nếu không được đáp lại bạn sẽ trở thành người đau khổ nhất thế giới.</em></blockquote><blockquote><em>MOO</em></blockquote><blockquote><em>Tình yêu là một cái gì đó rất thiêng liêng và mạnh mẽ. Đừng lạm dụng nó.</em></blockquote><blockquote><em>Tình yêu là một cách tự nhiên để con người duy trì nồi giống.</em></blockquote><blockquote><em>Ẩn danh</em></blockquote><blockquote><em>Tình yêu là lý do để con người duy trì sự sống.</em></blockquote><blockquote><em>PHILL</em></blockquote><blockquote><em>Tình yêu là kiên nhẫn. Tình yêu là tử tế và không ghen tị với ai. Tình yêu không bao giờ là khoe khoang, cũng không tự phụ, không thô lỗ, không bao giờ ích kỷ. Tình yêu không có điểm sai, không hả hê vì những sai lầm của người khác. Không có tình yêu nào không thể đối mặt, không có giới hạn của niềm tin và hy vọng, tình yêu không phải là chịu đựng. Một từ có ba thứ tồn tại mãi mãi: Niềm tin, hy vọng và tình yêu. Điều tuyệt vời nhất đó chính là tình yêu.</em></blockquote><blockquote><em>Tình yêu là kiên nhẫn, là sự tử tế và không ghen tị với ai. Tình yêu không bao giờ khoe khoang, cũng không tự phụ, thô lỗ và không ích kỷ. Tình yêu không có điểm sai, không hả hê vì những sai lầm của người khác.</em></blockquote><blockquote><em>Tình yêu là khi tất cả những gì bạn quan tâm là hạnh phúc, an toàn và sức khỏe của họ. Nếu họ xa bạn quá 2 phút, bạn sẽ nhớ nhung và mong mỏi được ở bên cạnh họ. Nụ cười của họ khiến bạn tan chảy, sự hiện diện của họ khiến bạn vui vẻ và hạnh phúc.</em></blockquote><blockquote><em>Omgggitsnick.</em></blockquote><blockquote><em>Tình yêu là khi người đó luôn nhắc nhở bạn về những gì bạn hay quên.</em></blockquote><blockquote><em>Tình yêu là khi con chó của bạn liếm mặt bạn khi bạn về nhà, mặc dù bạn để nó một mình cả ngày.</em></blockquote><blockquote><em>Ẩn danh.</em></blockquote><blockquote><em>Tình yêu là hành động quan tâm, chăm sóc và lo lắng… dành cho một người nào đó mà bạn yêu thương nhất và mong muốn mang lại thật nhiều hạnh phúc đến cuộc sống của họ.</em></blockquote><blockquote><em>Tình yêu là để cho đi tất cả những gì bạn có, và không mong đợi bất cứ sự đền đáp nào.</em></blockquote><blockquote><em>Balot Head</em></blockquote><blockquote><em>Tình yêu là cho đi tất cả những gì của bạn thân đang có và không giữ lại cho mình bất cứ điều gì.</em></blockquote><blockquote><em>Tình yêu là cho ai đó sức mạnh để hủy hoại và bạn dành cho họ một sự tin tưởng tuyệt đối. Có một ranh giới rất mỏng manh giữa 2 sự&nbsp;“yêu” và “ghét”.</em></blockquote><blockquote><em>Tình yêu là cho ai đó sức mạnh để huỷ hoại bạn và bạn dành cho họ một sự tin tưởng tuyệt đối. Có một ranh giới rất mỏng manh giữa yêu và ghét.</em></blockquote><blockquote><em>MyLittlePwny</em></blockquote><blockquote><em>Tình yêu là cảm giác rất tuyệt vời không thể diễn tả bằng lời. Tình yêu là một thứ gì đó vô cùng mạnh mẽ. Khi bạn đang yêu, bạn sẽ muốn dành thời gian ở cạnh người đó. Và khi không được ở cạnh, bạn luôn suy nghĩ về họ bởi vì bạn rất cần người đó, nếu không có họ cuộc sống của bạn dường như trở nên không trọn vẹn.</em></blockquote><blockquote><em>Tình yêu là cách tự nhiên để cho bạn biết rằng, ngay cả khi bạn vui vẻ, bạn vẫn có thể cảm thấy đau đớn tột cùng.</em></blockquote><blockquote><em>James</em></blockquote><blockquote><em>Tình yêu hoặc là một căn bệnh khủng khiếp hoặc là một phước lành.</em></blockquote><blockquote><em>Antigamer.com</em></blockquote><blockquote><em>Tình yêu có thể là niềm vui và đôi khi là nỗi&nbsp;buồn. Nhưng chúng ta không thể dự đoán trước được điều gì sẽ diễn ra trong tương lai.</em></blockquote><h2>13. Những hình ảnh hài hước về tình yêu</h2><p>Sau đây là tổng hợp các bức ảnh vui nhộn về mối quan hệ yêu đương.</p><p><a href=\"about:blank\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: rgb(190, 30, 45); background-color: transparent;\"><img src=\"https://didongviet.vn/dchannel/wp-content/uploads/2023/02/tinh-yeu-didongviet.jpg\"></a><em>Anh muốn trốn nợ cả đời cùng em</em></p><p><a href=\"about:blank\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: rgb(190, 30, 45); background-color: transparent;\"><img src=\"https://didongviet.vn/dchannel/wp-content/uploads/2023/02/tinh-yeu-didongviet1.jpg\"></a><em>Thả thính lầy</em></p><p><a href=\"about:blank\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: rgb(190, 30, 45); background-color: transparent;\"><img src=\"https://didongviet.vn/dchannel/wp-content/uploads/2023/02/tinh-yeu-didongviet2.jpg\"></a><em>Hài hước</em></p><p><a href=\"about:blank\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: rgb(190, 30, 45); background-color: transparent;\"><img src=\"https://didongviet.vn/dchannel/wp-content/uploads/2023/02/tinh-yeu-didongviet3.jpg\"></a><em>Lời tỏ tình lạnh lùng nhất</em></p><p><a href=\"about:blank\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: rgb(190, 30, 45); background-color: transparent;\"><img src=\"https://didongviet.vn/dchannel/wp-content/uploads/2023/02/tinh-yeu-didongviet4.jpg\"></a><em>Khi yêu và khi có gia đình</em></p><h2>14. Kết luận</h2><p><a href=\"https://didongviet.vn/dchannel/tinh-yeu/\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: rgb(190, 30, 45); background-color: transparent;\">Tình yêu</a>&nbsp;là tình cảm thiêng liêng của con người. Hy vọng qua bài viết này bạn sẽ có cái nhìn đúng đắn về tình cảm này. Chúc bạn sớm tìm được một người hòa hợp và yêu thương mình.</p><p>Hãy theo dõi trang&nbsp;<a href=\"https://didongviet.vn/dchannel/\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: rgb(190, 30, 45); background-color: transparent;\">Dchannel</a>&nbsp;để cập nhật thêm nhiều thông tin,&nbsp;<a href=\"https://didongviet.vn/dchannel/kien-thuc/\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: rgb(190, 30, 45); background-color: transparent;\">kiến thức</a>&nbsp;với đa dạng chủ đề mới mẻ khác nhau mỗi ngày nhé.&nbsp;Đừng quên&nbsp;<strong>“MUA&nbsp;</strong><a href=\"https://didongviet.vn/dien-thoai.html\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: rgb(190, 30, 45); background-color: transparent;\"><strong>ĐIỆN THOẠI</strong></a><strong>&nbsp;ĐẾN DI ĐỘNG VIỆT”</strong>&nbsp;để nhanh tay&nbsp;sở hữu ngay các suất quà tặng mua sản phẩm với giá rẻ nhất thị trường nhân dịp cuối năm số lượng có hạn nhé.</p>','2024-11-30 23:38:38','2025-06-05 07:36:50',1,6,'/uploads/blogger/banner/1749109007688_tinh-yeu-la-gi-6.jpg',36,'Tình yêu là gì ?',19),(7,'Hình nền máy tính 4k thiên nhiên\r\nHình nền máy tính 4k về thiên nhiên là một trong những chủ đề được nhiều người ưa thích lựa chọn bởi các cảnh quan thiên nhiên đầy hùng vĩ, thơ mộng, từ đó tạo cảm giác thư giãn mỗi khi nhìn vào hình nền màn hình máy tính và giúp xoa dịu ánh mắt mệt mỏi sau nhiều giờ làm việc hay học tập.![image.png](http://localhost:5217/uploads/image.png)\r\n\r\nVới độ phân giải cao và chất lượng hình ảnh sắc nét, đây chắc chắn là lựa chọn lý tưởng cho hình nền máy tính, đặc biệt phù hợp với những người đam mê thiên nhiên hoặc muốn thưởng thức vẻ đẹp của cảnh quan, thực vật, và địa hình núi non. Hình nền 4K siêu đẹp, tha hồ lựa chọn. Click vào ảnh để tải về máy tính ngay!\r\n\r\n130+ hình nền máy tính 4k, full HD đa dạng\r\nBức tranh thiên nhiên về thác nước sinh động\r\nHình nền máy tính 4k thiên nhiên\r\nBầu trời bình minh trên khu rừng thông đầy tuyết\r\nHình nền máy tính 4k thiên nhiên siêu đẹp\r\nCon thuyền trôi giữa mặt nước tĩnh lặng\r\nHình nền máy tính 4k về chủ đề thiên nhiên \r\nKhung cảnh hùng vĩ với ngồi nhà giữa làn sương khói huyền ảo\r\nHình nền máy tính thiên nhiên siêu đẹp\r\nCảnh núi hùng vĩ trong bầu trời đầy nắng\r\nHình nền 4k thiên nhiên\r\nBầu trời đầy sương khói giữa làn nắng trog veo trên các ngọn đồi\r\n130+ hình nền máy tính 4k, full HD siêu đẹp\r\nNhững ngọn núi cao tận trời kết họp cùng bầu trời ảm đạm\r\nHình nền máy tính đẹp về thiên nhiên\r\nKhu rừng xanh mắt với các ngọn núi đầy hùng vĩ\r\ntổng hợp kho Hình nền máy tính 4k thiên nhiên\r\nKhu rừng ngập tràn sắc màu đỏ từ lá cây\r\nhình nền màn hình 4k thiên nhiên cực chill\r\nBầu trời huyền ảo muôn màu kết hợp cùng dòng sông xanh biếc\r\n130+ hình nền máy tính full HD đa dạng, siêu đẹp\r\nCánh đồng xanh với những ngôi nhà trước ngọn núi hùng vĩ\r\n130+ hình nền máy tính full HD về chủ đề thiên nhiên\r\nMặt biển tĩnh lặng trước khung cảnh thiên nhiên hùng vĩ\r\n130+ hình nền máy tính full HD đa dạng, siêu đẹp về chủ dề thiên nhiên\r\nBuổi chiều tà tại các những ngọn núi thiên nhiên đồ sộ\r\ntổng hợp hình nền về thiên nhiên\r\nVùng đất đầy ắp cây xanh với những ngọn núi trập trùng to lớn\r\nhình nền máy tính 4k, full HD đa dạng, siêu đẹp\r\nCảnh tượng thác nước chảy trên bức tượng người tại quần đảo\r\ntổng hợp hình nền cực đẹp về thiên nhiên\r\nMặt hồ yên tĩnh nhỏ bé trước cảnh tượng hùng vĩ\r\nhình nền thiên nhiên cho máy tính\r\nThiên nhiên hùng vĩ trước bầu trời rộng lớn\r\n130 hinh nen may tinh 4k 19\r\nMặt biển yên tĩnh trước ngọn đồi đầy tuyết\r\ntổng hợp Hình nền máy tính 4k thiên nhiên\r\nCon đường dẫn đến mặt biển tĩnh lặng giữa bầu trời rộng lớn\r\nHình nền máy tính 4k du lịch\r\nChủ đề về du lịch cũng là chủ đề ưa thích để nhiều người lựa chọn làm hình nền, với các cảnh quan của nhiều địa điểm nổi tiếng trên thế giới. Đây chắc chắn là chủ đề phù hợp với những người thích phiêu lưu, khám phá những vùng đất mới mà trong tương lai sẽ trải nghiệm thử. Sau đây là một sô hình ảnh bạn có thể tham khảo:\r\n\r\nHình nền máy tính 4k du lịch\r\nKhám phá kỳ quang Taj Mahal tráng lệ\r\nHình nền máy tính 4k du lịch cực đẹp\r\nNgất ngây với vẻ đẹp kỳ thú ở cao nguyên Kon Hà Nừng\r\nHình nền máy tính 4k du lịch siêu đẹp\r\nBán đảo Lofoten Na Uy của vùng cực Bắc?\r\nHình nền 4k du lịch dành cho máy tính\r\nMặt biển trong xanh tại một đảo nhỏ\r\ntổng hợp Hình nền máy tính 4k du lịch\r\nKhung cảnh tại Vịnh Hạ Long đầy hùng vĩ\r\ntổng hợp các hình nền máy tính 4k du lịch\r\nTháp đồng hồ Big Ben điểm đáng hàng đầu trên thế giới\r\nHình nền máy tính về du lịch\r\nBãi đá cổ Stonehenge tại London\r\nHình nền máy tính về chủ đề du lịch\r\nThị trấn tại một thành phố của Ý\r\nHình nền máy tính 4k du lịch cực kỳ đẹp mắt\r\nChiêm ngưỡng tháp đồng hồ tại Phú Quốc\r\nhình nền về chủ đề du lịch cực đẹp\r\nThành phố Melbourne điểm đến du lịch hàng đầu tại Úc\r\nHình nền máy tính 4k du lịch siêu nét\r\nSpiez, hồ Thun tại Thụy Sĩ\r\n130 Hình nền máy tính 4k du lịch\r\nPhố cổ Lucerne tại Thụy sĩ\r\n130 Hình nền về máy tính 4k du lịch\r\nCổng thành Brandenburg, biểu tượng của nước Đức\r\n130 Hình nền máy tính 4k du lịch siêu nét\r\nĐấu trường La Mã nổi tiếng bạn nên đến một lần\r\ntổng hợp các Hình nền máy tính 4k du lịch\r\nKhu phố cổ tại thành phố của Trung Quốc\r\ntổng hợp các bức hình 4k về chủ đề du lịch\r\nPhượng Hoàng cổ Trấn đầy cổ kín\r\nhình nền máy tính 4k full HD\r\nNhà hát Opera Sydney biểu tượng của nước Úc\r\nhình nền máy tính 4k phong cảnh\r\n![130-hinh-nen-may-tinh-4k-80.jpg](http://localhost:5217/uploads/130-hinh-nen-may-tinh-4k-80.jpg)\r\nCổng Torri, lối vảo thế giới thần linh tại Nhật Bản\r\nhình nền phong cảnh du lịch\r\nKotor, miền cổ tích lãng quên\r\nhình nền về du lịch chill\r\nThị trấn cổ tích tại Hà Lan\r\ntổng hợp Hình nền về du lịch cực kỳ đẹp mắt\r\nNhững ngôi nhà trắng mái xanh tại Hy Lạp\r\n','2024-12-07 21:56:35','2025-06-07 16:03:38',1,6,'/uploads/blogger/banner/1749312217658_1931529677282_4283.jpg',36,'Tổng hợp các hình nền đẹp',55),(8,'<h2 class=\"ql-align-justify\" id=\"heading-0-con-trai-by-gi-s-ch--n-mt-c-nng-trng-nh-th-no-tiu-chun-gi-xinh-thi-8x-v-thi-hin-ti-c-g-khc-nhau-chng-ta-s-im-qua-vi-nt-tiu-biu\">Con trai bây giờ sẽ chú ý đến một cô nàng trông như thế nào? Tiêu chuẩn \"gái xinh\" thời 8x và thời hiện tại có gì khác nhau? Chúng ta sẽ điểm qua vài nét tiêu biểu.</h2><p class=\"ql-align-justify\"><br></p><ul><li class=\"ql-align-justify\"><a href=\"https://kenh14.vn/doi-song/nhung-dieu-con-trai-can-xac-dinh-neu-muon-tan-gai-xinh-20141815465821.chn\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: rgb(56, 62, 84);\">Những điều con trai cần “xác định” nếu muốn tán gái xinh&nbsp;</a></li><li class=\"ql-align-justify\"><a href=\"https://kenh14.vn/doi-song/con-gai-thoi-nay-chi-hoc-gioi-va-ngoan-cung-e-nhu-choi-20131002081451776.chn\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: rgb(56, 62, 84);\">Con gái thời nay, chỉ học giỏi và ngoan cũng ế như chơi!&nbsp;</a></li><li class=\"ql-align-justify\"><a href=\"https://kenh14.vn/doi-song/chuyen-nu-cong-gia-chanh-cua-con-gai-ngay-nay-co-gi-khac-20130906021237111.chn\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: rgb(56, 62, 84);\">Chuyện nữ công gia chánh của con gái ngày nay có gì khác?&nbsp;</a></li></ul><p class=\"ql-align-justify\">Nếu như trước đây, cụ thể rơi vào khoảng thời gian 10 năm trước, một cô gái nói chung hay một nữ sinh trung học nói riêng được xếp vào loại xinh xắn, tiêu biểu và luôn được chú ý với những quy chuẩn có nhiều nét liên quan tới truyền thống. Thời ấy, trào lưu hot girl cũng chưa xuất hiện, hoặc chỉ là nhen nhóm trong lòng giới trẻ mà chưa thịnh hành như bây giờ nên việc làm đẹp, chụp ảnh… đối với các cô gái trở thành một điều gì đó còn rất mới mẻ, lạ lẫm và hiếm gặp.</p><p class=\"ql-align-justify\">Nhắc tới vẻ bề ngoài thì một gương mặt mộc hài hòa, làn da trắng, mái tóc dài đen láy cắt ngang vai hay buông xõa… sẽ là những yếu tố không thể thiếu. Phong cách nói chung và phong cách ăn mặc nói riêng cũng thường là dễ thương, nữ tính na ná nhau. Còn những hành động làm đẹp gắn với sự phát triển của công nghệ như phẫu thuật thẩm mỹ hay xăm mình trở nên rất xa xỉ, thậm chí còn bị đánh giá vào tư cách đạo đức hay lối sống.</p><p class=\"ql-align-justify\">Thế nhưng, ở thời điểm hiện đại, mọi quan điểm ấy đã thay đổi rất nhiều, trở nên thoáng hơn và hòa nhập với thế giới hơn xưa. Rõ ràng ở thời bây giờ, ngoại hình sẽ là cái “đập” vào mắt người đối diện đầu tiên và giúp các cô gái để lại ấn tượng. Vậy nên việc làm đẹp bây giờ cũng được đặt ở vị trí quan trọng hơn trong list việc hàng ngày của con gái nói chung.</p><p class=\"ql-align-justify\">\"Một cô gái<em>&nbsp;để mặt mộc, mái tóc cứng và khô nhưng vẫn không ép hay sử dụng cách nào đó cho đẹp hơn, ăn mặc quá giản dị và không đúng kiểu khi đến một buổi prom... sẽ không được chúng tớ đánh giá cao đâu - tất nhiên đó mới chỉ là ấn tượng ban đầu và đánh giá ở kĩ năng làm đẹp cho bản thân.\"</em>&nbsp;- Một chàng trai hùng hồn tuyên bố. Và ngẫm ra thì, nhận xét của anh chàng này cũng không có gì bất hợp lý.</p><p class=\"ql-align-justify\"><img src=\"https://localhost:7217/uploads/posts/post_bd216869-a9fd-448c-a0c3-bc0fc76f26a7_638847307832805480.jpg\"></p><p class=\"ql-align-justify\"><strong>Trang điểm</strong></p><p class=\"ql-align-justify\"><em>Ngày ấy</em>: Lứa nữ sinh thuộc thế hệ 8x dường như không bao giờ biết tới việc đánh một chút phấn, hay tô một chút son khi tới trường, hoặc ít ra là trong các dịp lễ trọng đại của trường như khai giảng, bế giảng, lễ kỷ niệm 20/11… Làn da hơi tối màu hay gương mặt gặp vấn đề về mụn thì cũng là một điều gì đó rất bình thường của tuổi mới lớn. Nếu trang điểm khi tới trường thì sẽ bị cho là đua đòi, thậm chí sẽ dễ bị... ghét vì tự làm mình nổi bật hơn người khác.</p><p class=\"ql-align-justify\">Thanh Vân Hugo, một hot girl thuộc thế hệ 8x chia sẻ: \"<em>Ngày trước, thời Vân còn đi học cũng phải cách đây hơn chục năm rồi, quan niệm về cái đẹp giản dị lắm... Đi học không biết trang điểm là gì, chỉ tỉa chút lông mày đã thấy ngại với các bạn cùng lớp rồi. Vẻ đẹp của học sinh ngày xưa rất giản dị và thuần khiết, đơn giản vì chưa có nhiều phương pháp làm đẹp và có điều kiện vật chất như hiện tại. Bây giờ, các bạn trẻ biết cách làm đẹp từ rất sớm và công nghệ ngày càng nhiều nên các bạn ngày càng xinh đẹp và năng động. Mình thấy vui vì đã là con gái là phải đẹp, có điều kiện làm đẹp thì rất tuyệt, tuy nhiên đừng lạm dụng mỹ phẩm hay thẩm mỹ quá sớm hoặc quá nhiều mà sau này hối hận. Vì bản thân tuổi trẻ đã là một sắc đẹp vô giá mà tiền nào cũng không mua lại được, nên hãy tận dụng vẻ đẹp trời cho ấy càng lâu và càng tự nhiên càng tốt\".</em></p><p class=\"ql-align-justify\"><span style=\"color: transparent;\"><img src=\"https://kenh14cdn.com/k:Article/2013/09/19/t428035/nhin-qua-ngoai-hinh-de-thay-khac-biet-con-gai-xinh-ngay-ay-bay-gio.jpg\"></span></p><p class=\"ql-align-justify\">Chị Phạm Việt My, sinh năm 1986, một cô gái thuộc thế hệ 8x chia sẻ: \"<em>Nhìn các em học sinh cấp 3 bây giờ đúng là quá khác so với thời cấp 3 đi học của bọn chị ngày xưa. Các em đẹp hơn, năng động tự tin hơn, dám khẳng định mình hơn. Thời của bọn chị, nếu con gái làm điệu, trang điểm khi tới trường thì sẽ bị \"soi\" kinh khủng và cho là mải chơi, đú đởn, không lo học. Vậy nên gương mặt mộc, bộ đồng phục áo trắng quần xanh làm không được khác bất kỳ ai là một điều bắt buộc khi tới lớp.</em>\"</p><p class=\"ql-align-justify\">Chị Thanh Ngân, sinh năm 1984 tâm sự: \"<em>Như ngày xưa đi học phổ thông, con gái đứa nào đứa nấy tóc dài ơi là dài, không nhuộm không ép, cứ buộc túm đằng sau thôi. Còn trang điểm thì rất khó để tìm thấy. Thế nhưng mỗi thời mỗi khác, con trai thời đấy có vẻ thích những cô gái mộc mạc, chân chất như thế hơn. Những bạn chăm chút về ngoại hình khi đi học là bị con trai \"đánh giá\" ngay\".</em></p><p class=\"ql-align-justify\"><em>Bây giờ</em>: Có mặt tại các trường THPT vào các buổi lễ quan trọng, sẽ không hề khó để tìm ra một gương mặt nữ sinh xinh xắn, trang điểm nhẹ nhàng trong tà áo dài trắng. Nếu có ai đưa ra ý kiến rằng học sinh bây giờ \"đua đòi\" thế, son phấn \"lòe loẹt\" thì ngay lập tức ý kiến đó sẽ gặp phải rất nhiều sự phản bác của mọi người, bởi ngày nay, việc học sinh trang điểm vào những ngày lễ quan trọng của trường là bình thường.</p><p class=\"ql-align-justify\"><span style=\"color: transparent;\"><img src=\"https://kenh14cdn.com/k:thumb_w/600/H3ngOfr7Cdqeti5dtxQazuSaoTdmS/Image/2013/09/IMG_8813-copy-a1ed8-d6bc7/nhin-qua-ngoai-hinh-de-thay-khac-biet-con-gai-xinh-ngay-ay-bay-gio.jpg\"></span></p><p class=\"ql-align-justify\">\"<em>Đối với một số trường thì trong năm chỉ có những ngày đặc biệt như khai giảng hay bế giảng thì trường mới yêu cầu mặc áo dài, bởi vậy đối với các em nữ sinh thì đây là những dịp hiếm có, các em ấy muốn mình xinh hơn để chụp ảnh lưu niệm, thì make up, chải chuốt 1 tí, áo dài kiểu cách 1 tẹo... cũng đâu có gì sai? Tại sao lại có những người cứ vào ném đá các em ấy nhỉ? Làm mình đẹp hơn mà không quá lố thì nên khuyến khích chứ.</em>\" - Một ý kiến phản đối khi các nữ sinh bị... \"ném đá\" do make up đi khai giảng.</p><p class=\"ql-align-justify\"><span style=\"color: transparent;\"><img src=\"https://kenh14cdn.com/k:thumb_w/600/H3ngOfr7Cdqeti5dtxQazuSaoTdmS/Image/2013/09/IMG_9884-1c3a6-c53fc/nhin-qua-ngoai-hinh-de-thay-khac-biet-con-gai-xinh-ngay-ay-bay-gio.jpg\"></span></p><p class=\"ql-align-justify\"><em>Một hình ảnh tái hiện lại nữ sinh truyền thống - mái tóc đen dài trong tà áo dài trắng, giản dị mà vẫn rất đẹp. (Ảnh minh họa)</em></p><p class=\"ql-align-justify\"><br></p><p class=\"ql-align-justify\"><span style=\"color: transparent;\"><img src=\"https://kenh14cdn.com/k:H3ngOfr7Cdqeti5dtxQazuSaoTdmS/Image/2013/09/thuy-sun-3-819766-1372445402_500x0-c53fc/nhin-qua-ngoai-hinh-de-thay-khac-biet-con-gai-xinh-ngay-ay-bay-gio.jpg\"></span></p><p class=\"ql-align-justify\"><em>Nhưng make up nhẹ nhàng và với một mái tóc nhuộm, tà áo dài cũng kiểu cách hơn - rất nhiều nữ sinh bây giờ đến trường với một chút makeup, nhưng không vì thế mà bị soi. Họ vẫn rất xinh và thu hút ánh nhìn của các bạn khác phái đấy chứ.&nbsp;</em></p><p class=\"ql-align-justify\">Đứng ở góc nhìn từ thế hệ 8x, việc trang điểm khi tới trường sẽ làm học sinh lơ đãng, không còn tập trung vào công việc chính là học tập. Thế nhưng rõ ràng, xã hội bây giờ, việc làm đẹp là nhu cầu của bất kỳ ai. Hơn nữa nếu đã là 1 học sinh không mấy chăm chỉ thì sẽ có rất nhiều mối quan tâm khác, chứ không chỉ đơn thuần là “son phấn”. Vậy nên nữ sinh 9x bây giờ sẽ cảm thấy tự tin hơn, xinh đẹp hơn với một lớp phấn mỏng, son nhẹ, đôi mắt được chuốt để tạo điểm nhấn hay mái tóc được tạo kiểu cầu kỳ hơn thường ngày.</p><p class=\"ql-align-justify\">Bạn Thu Hà (THPT Phan Đình Phùng) chia sẻ: \"<em>Bản thân mình, bạn bè và kể cả một số thầy cô cũng không còn \"kì thị\" chuyện make up đi học nữa. Chỉ cần đừng quá lòe loẹt không phù hợp với học sinh thôi, chứ tô một chút son cho bớt nhợt nhạt, để tươi tắn hơn thì cũng có sao đâu\"</em>.</p><p class=\"ql-align-justify\"><span style=\"color: transparent;\"><img src=\"https://kenh14cdn.com/k:thumb_w/600/H3ngOfr7Cdqeti5dtxQazuSaoTdmS/Image/2013/09/IMG_1441-4e3b4-d6bc7/nhin-qua-ngoai-hinh-de-thay-khac-biet-con-gai-xinh-ngay-ay-bay-gio.jpg\"></span></p><p class=\"ql-align-justify\"><em>Có chút son, chút mắt kẻ, nhưng vẫn thật xinh và tươi.</em></p><p class=\"ql-align-justify\">Tuy nhiên, cũng phải nói lại rằng việc make up ở đây dừng lại ở mức độ nhẹ nhàng, đúng lứa tuổi, và chỉ phù hợp nhất khi không làm tốn quá nhiều thời gian, trong các dịp đặc biệt hoặc các buổi party, prom của trường học hay bạn bè.</p><p class=\"ql-align-justify\"><strong>Phong cách ăn mặc</strong></p><p class=\"ql-align-justify\"><em>Ngày ấy</em>: Một gương mặt được trang điểm đẹp, một mái tóc hợp với vóc dáng và tính cách sẽ chỉ được tôn vinh thực sự khi kết hợp cùng một bộ trang phục phù hợp. Rõ ràng trước kia, các cô gái luôn chỉ trung thành với một phong cách nữ tính, dịu dàng và hiền hòa không mấy nổi bật. Thời điểm ấy, khái niệm \"cá tính\" thể hiện qua vẻ ngoài, trang phục dường như chưa xuất hiện nên hầu như mọi người chỉ ăn mặc sao cho hợp mắt thôi chứ không hề chú ý tới việc bộ trang phục đấy nói lên điều gì về chính con người mình.</p><p class=\"ql-align-justify\"><em>Bây giờ</em>:&nbsp;Khi xã hội cho phép giới trẻ được thể hiện phong cách rõ ràng hơn thì các trào lưu về thời trang đã, đang và sẽ làm nên các “cơn sốt” trong lòng giới trẻ.</p><p class=\"ql-align-justify\">Nếu đi học, vẫn là áo trắng quần xanh, nhưng khi biết cách kết hợp với những phụ kiện đi kèm như giày, mũ, kính, ba lô, vòng vèo… một cách khéo léo thì trông nữ sinh ấy sẽ “style” hơn rất nhiều. Hay trong những buổi đi chơi cùng bạn bè, con gái bây giờ cũng kỹ càng trong việc lựa chọn trang phục hơn, chịu khó lên mạng để tìm hiểu các xu hướng đang “làm mưa làm gió” để khiến mình trở nên ấn tượng hơn.</p><p class=\"ql-align-justify\"><br></p><p class=\"ql-align-justify\">Không những thế, thời đại này, mỗi dịp đặc trưng đều gắn với những trang phục riêng. Con gái sẽ biết chọn mặc gì trong buổi dạo phố, mặc gì trong party,... Đó như một cách tạo ấn tượng và \"ghi điểm\" đầu tiên trong mắt các chàng trai cũng như tất cả mọi người.</p><p class=\"ql-align-justify\"><span style=\"color: transparent;\"><img src=\"https://kenh14cdn.com/k:Article/2013/09/18/nguyenhongandhsuphamtphcmgiaoduc.net.vn206/nhin-qua-ngoai-hinh-de-thay-khac-biet-con-gai-xinh-ngay-ay-bay-gio.jpg\"></span></p><p class=\"ql-align-justify\"><em>Vẫn là phong cách nữ tính, ngọt ngào có vẻ \"truyền thống\" nhưng con gái bây giờ đã biết \"điệu\" hơn với các phụ kiện đi kèm.</em></p><p class=\"ql-align-justify\">Khác với truớc kia, các cô gái thường không có gu ăn mặc, hoặc nếu có thì cũng kém đa dạng hơn, không dám phá cách, không dám thử thay đổi, làm mới chính mình thì ngày nay, bắt kịp xu hướng của thời đại, giới trẻ bây giờ đã và đang thoải mái thử nghiệm đủ phong cách ăn mặc, từ ảnh hưởng Hàn Quốc, Âu Mỹ cho đến những phong cách mà người khác cho là \"dị\". Thậm chí bây giờ các chàng trai sẽ chú ý ngay lập tức tới một cô nàng ăn mặc chất chất, có gu và sẽ sẵn sàng lờ đi một cô gái không biết cách làm mình nổi bật nhờ chuyện ăn mặc.</p><p class=\"ql-align-justify\">Quang Huy (19 tuổi) nói:&nbsp;<em>\"Với mình, ngoại hình của một cô gái rất quan trọng. Có thể cô ấy không cần xinh lung linh, thế nhưng điều đầu tiên là cô ấy không được xuề xòa với chính bản thân cô ấy. Bạn thử tưởng tượng mà xem, có ai muốn người yêu mình khi đi bên cạnh mà lại ăn mặc xuề xòa một cách qua loa đại khái, đầu tóc không chăm chút, rồi chân thì đi đôi dép ở nhà ra đường đâu. Một cô gái như thế sẽ làm cho mình có cảm giác cô ấy không tôn trọng mình. Chắc chắn mình sẽ khó có thể chọn được một cô nàng như vậy để làm bạn gái\".</em></p><p class=\"ql-align-justify\"><br></p><p class=\"ql-align-justify\"><span style=\"color: transparent;\"><img src=\"https://kenh14cdn.com/k:thumb_w/600/BTbXlm8EkGSICUZ2NYiccccccccccc/Image/2013/08/1278524_4700328444652_157503039_n-copy-29ca7/nhin-qua-ngoai-hinh-de-thay-khac-biet-con-gai-xinh-ngay-ay-bay-gio.jpg\"></span></p><p class=\"ql-align-justify\"><em>Một cô gái ăn mặc cá tính thế này sẽ được chú ý hơn nhiều khi đi trên phố.</em></p><p class=\"ql-align-justify\"><strong>Xăm mình không phải là hư hỏng</strong></p><p class=\"ql-align-justify\"><em>Trước đây</em>: Theo quan niệm của người dân Việt Nam, việc có những hình xăm trên cơ thể, đặc biệt là đối với các cô gái sẽ bị đánh giá vào tư cách đạo đức, bị cho là hư hỏng hay đổ đốn. Việc có những hình thù kỳ lạ trên cơ thể dường như chưa bao giờ được cho phép, nhất là đối với con gái.</p><p class=\"ql-align-justify\">Phạm Trà Ly, sinh năm 1985, chia sẻ: \"<em>Xăm mình ư? Hình như từ này không có trong suy nghĩ của bọn con gái thời còn đi học phổ thông và kể cả thời sinh viên. Những cô gái có hình xăm luôn bị mọi người chỉ trỏ, thậm chí là nghĩ rằng họ hư hỏng đến nơi rồi. Bố mẹ, người thân của chúng mình cũng thường xuyên răn đe con cái, gieo vào đầu các cô con gái của họ ý nghĩ: \"Xăm mình đồng nghĩa với... từ mặt\" cơ mà, nên không đứa nào dám hết\".</em></p><p class=\"ql-align-justify\"><em>Bây giờ</em>: Dần dần rồi giới trẻ cũng như những người lớn hơn cũng có cái nhìn dần thoáng hơn trước. Không quá khó để tìm ra một thiếu nữ với những hình xăm. Việc xăm mình đôi khi nói lên nét cá tính riêng biệt của từng cô gái, đôi khi để kỷ niệm một dấu mốc quan trọng trong cuộc đời hay đôi khi để thể hiện tình yêu, tình bạn hay sự quyến rũ, gợi cảm của bản thân…</p><p class=\"ql-align-justify\"><span style=\"color: transparent;\"><img src=\"https://kenh14cdn.com/k:Article/2013/09/30/a53/nhin-qua-ngoai-hinh-de-thay-khac-biet-con-gai-xinh-ngay-ay-bay-gio.jpg\"></span></p><p class=\"ql-align-justify\"><em>Hà Lade là một hot girl với lý lịch sạch, thành tích tốt. Việc cô nàng có tên trong danh sách&nbsp;</em><a href=\"http://kenh14.vn/doi-song/nhung-hot-girl-ha-thanh-nghien-xam-hinh-nhat-20130818105141184.chn\" rel=\"noopener noreferrer\" target=\"_blank\"><em>những hot girl \"nghiện\" xăm mình</em></a><em>&nbsp;đã chứng tỏ cái nhìn phóng khoáng của mọi người.</em></p><p class=\"ql-align-justify\"><span style=\"color: transparent;\"><img src=\"https://kenh14cdn.com/k:thumb_w/600/G1Jv1ccccccccccccsoL5ly9WD81F5/Image/2013/08/201308212320532125-cabdd-c58e2/nhin-qua-ngoai-hinh-de-thay-khac-biet-con-gai-xinh-ngay-ay-bay-gio.jpg\"></span></p><p class=\"ql-align-justify\"><em>Cô bạn Lee Zin là một ví dụ tiêu biểu cho con gái thời hiện đại. Vừa có cách make up \"độc\", phong cách ăn mặc \"dị\", Lee Zin còn sở hữu nhiều hình xăm trên người. Cô bạn vẫn được giới trẻ rất yêu mến.</em></p><p class=\"ql-align-justify\">Minh Quân (1987) nói:&nbsp;<em>\"Xưa khác, nay khác, không nên dùng những quan niệm cũ để áp đặt vào ngày nay được. Việc con gái có hình xăm ở thời điểm này không có gì lạ nữa, thậm chí nó còn là một cách để cô ấy thể hiện cá tính. Với mình, nếu đã thích một cô gái thì sẽ không vì việc cô ấy có một vài hình xăm trên người mà chia tay. Trái lại, nếu nó không quá nhức mắt và đó là một phần cá tính của cô ấy thì tại sao mình không lấy đó làm một điểm để yêu cô ấy hơn?\"</em></p><p class=\"ql-align-justify\"><strong>Phẫu thuật thẩm mỹ - tại sao lại không thể?</strong></p><p class=\"ql-align-justify\"><em>Ngày ấy</em>: Trong khi xăm mình bị cho là hư hỏng, lêu lổng thì phẫu thuật thẩm mỹ từng gắn liền với các cụm từ “đẹp giả tạo” hay “thiếu tự nhiên” vài năm về&nbsp;trước. Việc phẫu thuật thẩm mỹ chưa bao giờ được công nhận hay ủng hộ ở thời gian ấy. Công nghệ chưa phát triển hiện đại như bây giờ, các \"tai nạn\" sau phẫu thuật ngày ấy cũng được báo đài đưa tin nhiều, vậy nên rất khó nếu cô gái nào đó có một đôi mắt một mí, chiếc cằm quá thô hay sống mũi tẹt... mong muốn được đẹp hơn.</p><p class=\"ql-align-justify\"><em>Bây giờ</em>: Vẫn biết mỗi người luôn là duy nhất, vẻ đẹp của tạo hóa ban tặng vẫn là tự nhiên và bền chặt nhất nhưng nếu để tự tin hơn, có nhiều cơ hội mới hơn trong cuộc sống thì việc “sửa” một đôi nét nào đó trên gương mặt với phái yếu bây giờ đã trở thành bình thường.</p><p class=\"ql-align-justify\">Nâng mũi đối với những sống mũi chưa cao, nhấn mí đối với những đôi mắt chưa sâu hay bơm căng những đôi môi chưa thực sự quyến rũ… giờ đây đã trở thành những tiểu phẫu đơn giản và gần như hạn chế được rất nhiều biến chứng nguy hiểm sau phẫu thuật so với trước đây.</p><p class=\"ql-align-justify\"><span style=\"color: transparent;\"><img src=\"https://kenh14cdn.com/k:thumb_w/600/G1Jv1ccccccccccccsoL5ly9WD81F5/Image/2013/08/fa-pttm-10-90528-96adf/nhin-qua-ngoai-hinh-de-thay-khac-biet-con-gai-xinh-ngay-ay-bay-gio.JPG\"></span></p><p class=\"ql-align-justify\"><br></p><p class=\"ql-align-justify\"><em>Hạ Hồng Vân, Kelly dính nghi án gọt cằm, nâng mũi để được xinh đẹp như hôm nay. Nâng mũi đã trở thành tiểu phẫu đơn giản và được nhiều người thực hiện ở Việt Nam.</em></p><p class=\"ql-align-justify\">Có một gương mặt hoàn hảo hơn là mong ước chính đáng của con gái. Và việc chấp nhận bỏ ra một số tiền hay chịu đôi chút đau đớn để đẹp hơn trong thời đại này đã là điều không có gì quá trầm trọng hay gây shock nữa. Và dĩ nhiên là các chàng trai cũng sẽ không xem đó là điều quá ghê gớm khi đem lòng yêu một cô gái.&nbsp;</p><p class=\"ql-align-justify\"><em>\"Việc làm đẹp là nhu cầu của mỗi người. Một cô gái, nhất là người yêu của mình phẫu thuật thẩm mỹ, nếu không thay đổi quá nhiều và trở thành một người khác, việc nâng mũi, sửa cằm là điều chấp nhận được. Cô ấy làm đẹp cho mình chẳng phải cũng là một cách tôn trọng bạn sao?\"</em>&nbsp;- Thanh Hưng (1990) nói.</p><p class=\"ql-align-justify\">Dù vậy thì cũng chỉ được phẫu thuật khi đủ tuổi, đảm bảo các yêu cầu sức khỏe hay chọn “mặt” bác sỹ để “gửi vàng” cẩn thận.</p><p class=\"ql-align-justify\">Khi những tiêu chuẩn về ngoại hình đang dần thay đổi, chắc chắn những điều kiện khác như phong cách sống, chuyện nữ công gia chánh của phái nữ cũng sẽ vì thế mà thay đổi theo. Hãy cùng đón đọc những bài viết tiếp theo của chúng tôi để xem con trai ngày nay thích những cô gái có phong cách sống như thế nào, chuyện tề gia nội trợ ra sao nhé!</p>','2025-06-02 12:24:56','2025-06-05 07:33:50',1,3,'/uploads/blogger/banner/anh-co-gai-xinh-dep-59.jpg',36,'Nhìn qua ngoại hình để thấy khác biệt \"con gái xinh - ngày ấy, bây giờ\"...',59),(9,'<p class=\"ql-align-justify\">Đa phần&nbsp;<a href=\"https://toidicodedao.com/2016/04/21/thay-loi-muon-noi-goi-toi-nhung-nguoi-than-yeu-cua-moi-lap-trinh-vien/\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: rgb(36, 137, 13);\">dân developer tụi mình</a>&nbsp;là những thanh niên suốt ngày&nbsp;<a href=\"https://toidicodedao.com/2016/01/20/su-that-dang-long-doi-khi-cam-dau-ngoi-code-la-cach-ngu-nhat-de-giai-quyet-van-de/\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: rgb(36, 137, 13);\">cắm mặt vào code</a>, không thích quan hệ xã giao nên&nbsp;<strong>dễ bị FA, ít có gấu</strong>.</p><p class=\"ql-align-justify\">Do vậy, đối với nhiều bạn developer FA, tình iu là cái thứ gì đó mình mong muốn nhưng tìm hoài không có, hoặc chỉ thấy trên Voz hoặc mương 14 chứ chưa từng trải nghiệm bao giờ.</p><p class=\"ql-align-justify\">Ủa mà, nói đi nói lại thì, tình iu là tình yêu, còn code là code, hai thứ này&nbsp;<strong>thế quái nào mà liên quan với nhau</strong>&nbsp;cho được???</p><p class=\"ql-align-justify\">Ấy vậy mà có đấy! Dưới khả năng chém gió siêu phàm của Code Dạo thì&nbsp;<a href=\"https://toidicodedao.com/2018/10/18/chuyen-2-cai-xo-trong-ga-tau-dien-ngam-va-nhung-con-bug-ko-bao-gio-duoc-fix/\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: rgb(36, 137, 13);\">mấy cái xô và vài con bug</a>&nbsp;còn liên quan đến nhau, tại sao tình yêu và kinh nghiệm code lại không cơ chứ!</p><p class=\"ql-align-justify\"><strong>Bật mí</strong>: Nó sẽ giải thích vì sao có nhiều người làm lâu, kinh nghiệm nhiều nhưng&nbsp;<strong>lương cứ mãi lèo tèo, không phát triển được</strong>&nbsp;đấy.</p><p class=\"ql-align-justify\"><br></p><h3 class=\"ql-align-justify\"><strong>Chuyện tình cảm và thời gian yêu đương</strong></h3><p class=\"ql-align-justify\">Gần đây, mình có đọc cuốn&nbsp;<a href=\"https://shorten.asia/NdsRnP4w\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: rgb(36, 137, 13);\">Nơi em quay về có tôi đứng đợi</a>&nbsp;của&nbsp;<a href=\"https://fast.accesstrade.com.vn/deep_link/5021188873702111177?url=https%3A%2F%2Ftiki.vn%2Fauthor%2Fichikawa-takuji.html&amp;utm_campaign=S%3Fch+Ichikawa+Takuji&amp;utm_source=Blog\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: rgb(36, 137, 13);\">Ichikawa Takuji</a>. Sách viết về một câu chuyện tình sâu lắng, hơi buồn buồn và bi kịch một chút nhưng vẫn rất nhẹ nhàng, đọc cũng khá thoải mái.</p><p class=\"ql-align-justify\"><a href=\"https://toidicodedao.com/wp-content/uploads/2018/12/noi-em-quay-ve-co-toi-dung-doi-mot-khuc-tinh-ca-me-hoac.jpg\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: rgb(36, 137, 13);\"><img src=\"https://toidicodedao.com/wp-content/uploads/2018/12/noi-em-quay-ve-co-toi-dung-doi-mot-khuc-tinh-ca-me-hoac.jpg?w=356&amp;h=267\"></a></p><p class=\"ql-align-justify\"><em>Sách khá hay, bìa cũng đẹp, các bạn nên&nbsp;</em><a href=\"https://shorten.asia/hN5qyCek\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: rgb(36, 137, 13);\"><em>mua đọc thử tại Tiki</em></a><em>&nbsp;nhé!</em></p><p class=\"ql-align-justify\">&nbsp;</p><p class=\"ql-align-justify\">Thế rồi, đến chương gần cuối, mình bỗng đọc được một câu thoại khá hay và “đắt giá”.</p><pre class=\"ql-syntax\" spellcheck=\"false\">“Bây giờ tôi cảm thấy, yêu một người vẫn là một việc rất tuyệt vời.”\r\n....\r\n“Vì vậy, mong hai người được hạnh phúc.”\r\n“Chúng tôi đã vô cùng hạnh phúc rồi.”\r\n“Đúng thế, có một số cặp vợ chồng, dù sống với nhau năm chục năm cũng chẳng biết thế nào là yêu. Chuyện này chẳng can hệ gì với thời gian cả, phải vậy không?”\r\n</pre><p class=\"ql-align-justify\">Người ta thưởng lầm tưởng rằng gắn bó vời nhau càng lâu thì&nbsp;<strong>chắc chắn sẽ càng yêu nhau sâu đậm</strong>&nbsp;hơn. Thế nhưng, ngẫm lại thì sự thật chưa chắc vậy.</p><p class=\"ql-align-justify\">Advertisement</p><p class=\"ql-align-justify\">s</p><p class=\"ql-align-justify\">Đôi khi, người ta yêu nhau chỉ vì … FA nên quơ đại, vì thèm gấu ôm hoặc thèm người đi ăn chung. Có thể (nhắc lại là có thể) tình cảm sẽ nảy sinh qua thời gian dài gắn bó; nhưng cũng có thể là … tình cảm&nbsp;<strong>méo quan hệ gì với thời gian</strong>&nbsp;cả!</p><p class=\"ql-align-justify\">Thế nên trên Voz mới có những chuyện vài cặp đôi yêu nhau 3-5 năm, đùng một phát thanh niên&nbsp;<strong>phát hiện mình bị cắm sừng</strong>&nbsp;vì người yêu lỡ “cảm nắng” một ai đó, vì “anh ấy khiến em cảm thấy được yêu thực sự, không phải như anh” … hay đại loại thế.</p><p class=\"ql-align-justify\"><a href=\"https://toidicodedao.com/wp-content/uploads/2018/12/43070564_154955132111810_883635030901915648_n-e1545278236418.jpg\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: rgb(36, 137, 13);\"><img src=\"https://toidicodedao.com/wp-content/uploads/2018/12/43070564_154955132111810_883635030901915648_n-e1545278236418.jpg?w=363&amp;h=205\"></a></p><p class=\"ql-align-justify\"><em>Tổng hợp&nbsp;</em><a href=\"https://www.facebook.com/TruyenGauVozforums/posts/t%E1%BB%95ng-h%E1%BB%A3p-16-con-g%E1%BA%A5u-c%E1%BA%AFm-s%E1%BB%ABng-bachdev-t%E1%BB%95ng-h%E1%BB%A3p-m%E1%BB%99t-s%E1%BB%91-topic-bu%E1%BB%93n-c%E1%BB%A7a-anh-em-trong/521325264606276/\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: rgb(36, 137, 13);\"><em>16 chuyện gấu cắm sừng</em></a><em>&nbsp;cho các anh em</em></p><h3 class=\"ql-align-justify\"><strong>Kinh nghiệm …. đôi khi cũng vậy</strong></h3><p class=\"ql-align-justify\">Ủa, mà ba cái chuyện tình cảm lòng vòng này thì liên quan gì đến code??</p><p class=\"ql-align-justify\">Ấy vậy mà có đấy! Thấy những người&nbsp;<strong>bên cạnh nhau bao năm nhưng chẳng biết thế nào là yêu</strong>, mình lại nghĩ đến vài bạn trẻ&nbsp;<a href=\"https://toidicodedao.com/2017/06/06/dung-cong-nghe-hieu-cong-nghe/\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: rgb(36, 137, 13);\">code bao nhiêu năm</a>&nbsp;nhưng&nbsp;<strong>không bao giờ lên được tầm&nbsp;software engineer, system architect</strong>.</p><p class=\"ql-align-justify\">Thông thường, developer được đánh giá&nbsp;<a href=\"https://toidicodedao.com/2015/06/18/con-duong-phat-trien-su-nghiep-career-path-cho-developer/\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: rgb(36, 137, 13);\">dựa theo số năm kinh nghiệm</a>. Người ta tưởng rằng developer có 4-5 năm kinh nghiệm sẽ&nbsp;<strong>biết nhiều hơn và giỏi hơn</strong>&nbsp;developer 1-2 năm (cũng giống như yêu 4-5 năm sẽ yêu nhiều hơn 1-2 năm vậy).</p><p class=\"ql-align-justify\">Điều này, đôi khi chưa chắc đã đúng!</p><p class=\"ql-align-justify\">Trên lý thuyết, developer có 4-5 năm sẽ tiếp xúc với nhiều công nghệ hơn, làm nhiều dự án hơn =&gt; giỏi hơn. Đây là chuyện đương nhiên.</p><p class=\"ql-align-justify\">Tuy vậy, cũng có trường hợp một developer&nbsp;<strong>gắn bó với 1 công ty mười năm</strong>&nbsp;chỉ dùng đi dùng lại 1 công nghệ, bảo trì sửa code&nbsp;<a href=\"https://toidicodedao.com/2018/05/08/tai-sao-da-phan-cac-cong-ty-thich-dung-cong-nghe-loi-thoi/\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: rgb(36, 137, 13);\">mấy cái dự án cũ xì</a>.</p><p class=\"ql-align-justify\">Hoặc một developer làm outsource vài năm chỉ biết&nbsp;<strong>code theo task đã giao</strong>&nbsp;chứ chưa bao giờ được cho&nbsp;<a href=\"https://toidicodedao.com/2018/10/25/lightning-talk-ki-22-con-duong-phat-trien-career-path-su-nghiep-cua-lap-trinh-vien/\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: rgb(36, 137, 13);\">làm architecture design, làm lead</a>.</p><p class=\"ql-align-justify\">Lúc này, 4 năm 10 năm kinh nghiệm cũng chỉ là 1 năm kinh nghiệm lặp đi lặp lại 4 lần, 10 lần mà thôi! Làm lâu,&nbsp;<strong>số năm kinh nghiệm thì nhiều nhưng kinh nghiệm thật sự thì ít!</strong></p><p class=\"ql-align-justify\"><a href=\"https://toidicodedao.com/wp-content/uploads/2018/12/A9X5JGECMAAZvSv-e1545278410409.png\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: rgb(36, 137, 13);\"><img src=\"https://toidicodedao.com/wp-content/uploads/2018/12/A9X5JGECMAAZvSv-e1545278410409.png?w=364&amp;h=326\"></a></p><p class=\"ql-align-justify\"><em>Bạn thật sự có vài năm kinh nghiệm, hay một năm lặp lại vài lần?</em></p><p class=\"ql-align-justify\">Cứ như vậy, bạn sẽ không phát triển được mà cứ đứng yên một chỗ. Lương cứ mãi lèo tèo,&nbsp;<strong>không lên lương lên chức được</strong>&nbsp;là do vậy!</p><h3 class=\"ql-align-justify\"><strong>Ủa, vậy anh đì vê lớp pờ phải làm sao?</strong></h3><p class=\"ql-align-justify\">Quay lại chuyện tình cảm chút nào.</p><p class=\"ql-align-justify\">Để xây dựng tình cảm, thời gian bên nhau là không đủ. Hai người còn phải quan tâm lẫn nhau, xây dựng kỉ niệm bằng cách&nbsp;<strong>đi ăn đi chơi đi du lịch</strong>&nbsp;đi nghỉ mát rồi … đi ngủ (ngủ chong xáng nha).</p><p class=\"ql-align-justify\"><a href=\"https://toidicodedao.com/wp-content/uploads/2017/11/22853463_1693371004066199_6419276668936080740_n.jpg\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: rgb(36, 137, 13);\"><img src=\"https://toidicodedao.com/wp-content/uploads/2017/11/22853463_1693371004066199_6419276668936080740_n-e1545278572231.jpg?w=400&amp;h=234\"></a></p><p class=\"ql-align-justify\"><em>Để cái hình làm minh họa dzị thui hihi</em></p><p class=\"ql-align-justify\">Chuyện đi làm cũng vậy! Không phải chỉ&nbsp;<a href=\"https://toidicodedao.com/2016/01/20/su-that-dang-long-doi-khi-cam-dau-ngoi-code-la-cach-ngu-nhat-de-giai-quyet-van-de/\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: rgb(36, 137, 13);\">cắm mặt vào code</a>&nbsp;là được. Ta còn phải quan sát xung quanh, tự hỏi mình: Ngày qua ngày, mình của hôm nay&nbsp;<strong>có giỏi hơn hôm trước</strong>&nbsp;hay không:</p><ul><li class=\"ql-align-justify\">Mình có học được cách&nbsp;<a href=\"https://toidicodedao.com/2015/04/09/review-sach-clean-code-a-handbook-of-agile-software-craftsmanship/\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: rgb(36, 137, 13);\">viết code tốt hơn</a>, chất lượng cao hơn hay không</li><li class=\"ql-align-justify\">Mình có học được công nghệ mới, áp dụng được nhiều công nghệ hay ho hay không</li><li class=\"ql-align-justify\">Mình có học được qui trình, cách làm việc hay cải tiến qui trình hay không</li><li class=\"ql-align-justify\">Mình có được giao nhiều trách nhiệm hơn (design system hoặc module thay vì code, trò chuyện với khách hơn, lead team, deploy và monitoring) hay không</li><li class=\"ql-align-justify\">Mình có được trải qua nhiều dự án, giải quyết&nbsp;<strong>các vấn đề thực sự</strong>&nbsp;của người dùng không</li></ul><p class=\"ql-align-justify\">Các bạn thấy đấy, không phải cứ đi làm là sẽ có kinh nghiệm, mà quan trọng là môi trường làm việc, công ty làm việc nữa!</p><p class=\"ql-align-justify\">Một năm trong team xịn của Vinagame, Zalo hoặc startup xịn, làm&nbsp;<a href=\"https://toidicodedao.com/2017/08/01/thiet-ke-he-thong-trieu-nguoi-dung-high-scalability/\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: rgb(36, 137, 13);\">dự án trăm nghìn người dùng</a>; sẽ có giá trị hơn vài năm&nbsp;<a href=\"https://toidicodedao.com/2019/01/17/lam-cong-ty-outsource-product-hay-startup/\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: rgb(36, 137, 13);\">làm ở công ty outsource</a>, làm đi làm lại vài cái web bán hàng, web tin tức app quảng cáo!</p><p class=\"ql-align-justify\"><a href=\"https://toidicodedao.com/wp-content/uploads/2018/12/Screen-Shot-2018-12-20-at-12.05.30-PM.jpg\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: rgb(36, 137, 13);\"><img src=\"https://toidicodedao.com/wp-content/uploads/2018/12/Screen-Shot-2018-12-20-at-12.05.30-PM.jpg?w=445&amp;h=196\"></a></p><p class=\"ql-align-justify\"><em>Team Zalo có nhiều trai xinh gái đẹp nên mình để ké tấm hình lun</em></p><h3 class=\"ql-align-justify\"><strong>Tạm kết</strong></h3><p class=\"ql-align-justify\">Túm cái quần lại, mình chỉ có một lời khuyên nho nhỏ với những bạn đã đi làm hoặc mới ra trường:</p><ul><li class=\"ql-align-justify\">Để phát triển trong ngành, hãy tìm một công ty tốt, nơi mình có thể&nbsp;<strong>phát triển bản thân</strong>, ngày một giỏi hơn.</li><li class=\"ql-align-justify\">Nếu sau 1, 2 năm làm việc, cảm thấy mình dần dần không học hỏi thêm được gì, mình không tốt hơn mình một năm trước, hãy&nbsp;<strong>tìm một môi trường phù hợp</strong>&nbsp;để phát triển hơn</li><li class=\"ql-align-justify\">Hãy chắc chắn thứ mình thu được là&nbsp;<strong>kinh nghiệm thực sự</strong>, chứ không phải là kinh nghiệm lặp đi lặp lại</li><li class=\"ql-align-justify\"><strong>Bonus</strong>: Bạn nào có gấu, yêu lâu cũng đừng coi thường nhé. Nhớ chăm lo, yêu gấu nhiều nhiều vào nha.</li></ul><p class=\"ql-align-justify\">&nbsp;</p><p class=\"ql-align-justify\"><strong>P/S:</strong>&nbsp;Để theo dõi bài viết trên Tôi Đi Code Dạo, nhớ&nbsp;<a href=\"http://bit.ly/codedao-bot\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: rgb(36, 137, 13);\">Subscribe Chat Bot</a>&nbsp;của tụi mình nha. Bot của Code Dạo sẽ gửi bạn những bài viết cực kì hay ho về&nbsp;<strong>kĩ năng mềm và cứng, kinh nghiệm trong ngành</strong>&nbsp;vào&nbsp;<strong>thứ 4 hàng tuần</strong>&nbsp;nhé!</p>','2025-06-02 13:12:49','2025-06-05 00:29:53',1,1,'/uploads/blogger/banner/d3539da2-42bd-4179-a379-cff477730acf.jpg',36,'Chuyện Code Chuyện Đời – Lại chuyện tình iu và chuyện kinh nghiệm code',25);
/*!40000 ALTER TABLE `tblblogger` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblblogtype`
--

DROP TABLE IF EXISTS `tblblogtype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tblblogtype` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblblogtype`
--

LOCK TABLES `tblblogtype` WRITE;
/*!40000 ALTER TABLE `tblblogtype` DISABLE KEYS */;
INSERT INTO `tblblogtype` VALUES (1,'Front-end'),(2,'Mobile apps'),(3,'Back-end'),(4,'Dev'),(5,'UX-UI'),(6,'Others');
/*!40000 ALTER TABLE `tblblogtype` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblcode`
--

DROP TABLE IF EXISTS `tblcode`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tblcode` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` text,
  `codeId` varchar(10) DEFAULT NULL,
  `discount` decimal(10,0) DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `startDate` datetime DEFAULT NULL,
  `endDate` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblcode`
--

LOCK TABLES `tblcode` WRITE;
/*!40000 ALTER TABLE `tblcode` DISABLE KEYS */;
/*!40000 ALTER TABLE `tblcode` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblcodesubmit`
--

DROP TABLE IF EXISTS `tblcodesubmit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tblcodesubmit` (
  `id` int NOT NULL,
  `userId` int NOT NULL,
  `submittedCode` text,
  `isCorrect` tinyint(1) DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`,`userId`),
  KEY `tblCodeSubmit_tblUser_FK` (`userId`),
  CONSTRAINT `tblCodeSubmit_tblQuestionCode_FK` FOREIGN KEY (`id`) REFERENCES `tblquestioncode` (`id`),
  CONSTRAINT `tblCodeSubmit_tblUser_FK` FOREIGN KEY (`userId`) REFERENCES `tbluser` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblcodesubmit`
--

LOCK TABLES `tblcodesubmit` WRITE;
/*!40000 ALTER TABLE `tblcodesubmit` DISABLE KEYS */;
INSERT INTO `tblcodesubmit` VALUES (54,32,'console.log(\'Hello world\');',1,'2024-12-29 12:27:15'),(54,36,'console.log(\'Hello world\');',0,'2025-03-20 19:52:32'),(57,36,'',1,'2025-01-01 13:14:27'),(58,32,'',1,'2025-05-06 15:22:08'),(58,36,'',1,'2025-05-13 15:08:09');
/*!40000 ALTER TABLE `tblcodesubmit` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblcommentlesson`
--

DROP TABLE IF EXISTS `tblcommentlesson`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tblcommentlesson` (
  `userId` int DEFAULT NULL,
  `lessonId` int DEFAULT NULL,
  `parent_id` int DEFAULT NULL,
  `content` text,
  `id` int NOT NULL AUTO_INCREMENT,
  `createAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `prohibited` tinyint(1) DEFAULT '0',
  `updateAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `isDelete` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `tblCommentLesson_tblUser_FK` (`userId`),
  KEY `tblCommentLesson_tblLectureDetails_FK` (`lessonId`),
  KEY `tblCommentLesson_tblCommentLesson_FK` (`parent_id`),
  CONSTRAINT `tblCommentLesson_tblCommentLesson_FK` FOREIGN KEY (`parent_id`) REFERENCES `tblcommentlesson` (`id`),
  CONSTRAINT `tblCommentLesson_tblLectureDetails_FK` FOREIGN KEY (`lessonId`) REFERENCES `tbllecturedetails` (`id`),
  CONSTRAINT `tblCommentLesson_tblUser_FK` FOREIGN KEY (`userId`) REFERENCES `tbluser` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=194 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblcommentlesson`
--

LOCK TABLES `tblcommentlesson` WRITE;
/*!40000 ALTER TABLE `tblcommentlesson` DISABLE KEYS */;
INSERT INTO `tblcommentlesson` VALUES (32,49,NULL,'xịn quá',158,'2025-01-03 19:42:05',0,'2025-01-03 19:42:05',0),(36,55,NULL,'haha',159,'2025-03-20 19:48:05',0,'2025-03-20 19:48:05',0),(36,55,NULL,'khá',160,'2025-03-20 19:48:24',0,'2025-03-20 19:48:24',1),(36,55,NULL,'alo',161,'2025-03-20 19:48:41',0,'2025-03-20 19:48:41',0),(36,33,NULL,'skibidi 😂',162,'2025-04-28 09:24:57',0,'2025-04-28 22:49:12',0),(32,35,NULL,'dạ',163,'2025-05-05 19:23:53',0,'2025-05-05 19:23:53',1),(32,35,NULL,'â',164,'2025-05-06 12:22:45',0,'2025-05-06 12:22:45',0),(36,35,NULL,'sấ',165,'2025-05-06 12:22:57',0,'2025-05-06 12:22:57',0),(36,58,NULL,'hí',166,'2025-05-06 12:24:32',0,'2025-05-06 12:24:32',0),(32,58,NULL,'alo',167,'2025-05-06 12:26:55',0,'2025-05-06 12:26:55',0),(32,35,NULL,'ủa',168,'2025-05-06 12:40:19',0,'2025-05-06 12:40:19',0),(32,35,NULL,'ll',169,'2025-05-06 12:59:48',0,'2025-05-06 12:59:48',0),(32,35,NULL,'j',170,'2025-05-06 13:11:01',0,'2025-05-06 13:11:01',0),(32,58,NULL,'aa',171,'2025-05-06 17:03:47',0,'2025-05-06 17:03:47',0),(32,58,NULL,'a',172,'2025-05-06 17:34:47',0,'2025-05-06 17:34:47',0),(32,58,NULL,'a',173,'2025-05-06 17:34:51',0,'2025-05-06 17:34:51',0),(36,58,NULL,'aaa',174,'2025-05-06 17:41:31',0,'2025-05-06 17:41:31',0),(32,58,NULL,'s',175,'2025-05-06 17:44:07',NULL,'2025-05-06 17:44:07',0),(32,33,NULL,'hello',176,'2025-05-08 15:59:16',0,'2025-05-08 15:59:16',0),(32,33,162,'ủa',177,'2025-05-08 16:00:29',0,'2025-05-08 16:00:29',0),(36,49,NULL,'aa',178,'2025-05-08 16:53:12',0,'2025-05-08 16:53:12',0),(36,34,NULL,'ủa',179,'2025-05-08 23:18:09',0,'2025-05-08 23:18:09',0),(36,34,NULL,'ủa\n',180,'2025-05-08 23:19:01',0,'2025-05-08 23:19:01',0),(36,34,NULL,'ủa',181,'2025-05-08 23:19:21',0,'2025-05-08 23:19:21',0),(36,34,NULL,'yêu anh không',182,'2025-05-08 23:19:29',0,'2025-05-08 23:20:06',0),(36,34,182,'ủa anh',183,'2025-05-08 23:20:56',0,'2025-05-08 23:20:56',0),(32,34,NULL,'aduf',184,'2025-05-11 17:02:11',0,'2025-05-11 17:02:11',0),(36,60,NULL,'fghj',185,'2025-05-13 14:22:51',0,'2025-05-13 14:22:51',0),(36,49,158,'dạ cảm ơn',186,'2025-05-13 15:02:02',0,'2025-05-13 15:02:02',0),(36,35,NULL,'kkkk',187,'2025-05-27 09:21:17',0,'2025-05-27 09:21:17',0),(36,35,168,'ngu như bò',188,'2025-05-30 11:37:15',0,'2025-05-30 11:37:15',0),(36,35,NULL,'<p>alo</p>',189,'2025-05-30 11:41:20',0,'2025-05-30 11:41:20',0),(36,35,NULL,'<p style=\"text-align:left;\">ngu thật</p>\n',190,'2025-05-30 11:59:25',0,'2025-05-30 11:59:25',0),(36,51,NULL,'<p>u</p>',191,'2025-06-02 01:10:46',0,'2025-06-02 01:10:46',0),(36,35,NULL,'<p>s</p>',192,'2025-06-02 01:33:51',0,'2025-06-02 01:33:51',0),(36,33,NULL,'<p>d</p>',193,'2025-06-02 02:02:45',0,'2025-06-02 02:02:45',0);
/*!40000 ALTER TABLE `tblcommentlesson` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblcommentreport`
--

DROP TABLE IF EXISTS `tblcommentreport`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tblcommentreport` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userIdReport` int DEFAULT NULL,
  `commentId` int DEFAULT NULL,
  `createAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `tblCommentReport_tblUser_FK` (`userIdReport`),
  KEY `tblCommentReport_tblCommentLesson_FK` (`commentId`),
  CONSTRAINT `tblCommentReport_tblCommentLesson_FK` FOREIGN KEY (`commentId`) REFERENCES `tblcommentlesson` (`id`),
  CONSTRAINT `tblCommentReport_tblUser_FK` FOREIGN KEY (`userIdReport`) REFERENCES `tbluser` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblcommentreport`
--

LOCK TABLES `tblcommentreport` WRITE;
/*!40000 ALTER TABLE `tblcommentreport` DISABLE KEYS */;
/*!40000 ALTER TABLE `tblcommentreport` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblcourse`
--

DROP TABLE IF EXISTS `tblcourse`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tblcourse` (
  `id` int NOT NULL AUTO_INCREMENT,
  `levelId` int NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `banner` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT NULL,
  `duration` bigint DEFAULT '0',
  `introduce` text,
  PRIMARY KEY (`id`),
  KEY `levelId` (`levelId`),
  CONSTRAINT `tblCourse_ibfk_1` FOREIGN KEY (`levelId`) REFERENCES `level` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblcourse`
--

LOCK TABLES `tblcourse` WRITE;
/*!40000 ALTER TABLE `tblcourse` DISABLE KEYS */;
INSERT INTO `tblcourse` VALUES (3,1,'Lập Trình JavaScript Cơ Bản','2024-12-12 00:00:00','2025-01-02 17:29:24','/images/courses/JS.png',1,99365,'<p>Hiểu sâu hơn về cách Javascript hoạt động, tìm hiểu về IIFE, closure, reference types, this keyword, bind, call, apply, prototype, ...</p>'),(36,1,'Kiến Thức Nhập Môn IT','2025-05-09 10:14:58','2025-05-09 10:14:58','/images/courses/7.png',1,0,'<p><span style=\"color: rgba(0, 0, 0, 0.8);\">Để có cái nhìn tổng quan về ngành IT - Lập trình web các bạn nên xem các videos tại khóa này trước nhé.</span></p>'),(37,1,'Lập trình C++ cơ bản, nâng cao','2025-05-09 10:16:34','2025-05-09 10:16:34','/images/courses/c++.png',1,0,'<p><span style=\"color: rgba(0, 0, 0, 0.8);\">Khóa học lập trình C++ từ cơ bản tới nâng cao dành cho người mới bắt đầu. Mục tiêu của khóa học này nhằm giúp các bạn nắm được các khái niệm căn cơ của lập trình, giúp các bạn có nền tảng vững chắc để chinh phục con đường trở thành một lập trình viên.</span></p>'),(38,1,'HTML CSS từ Zero đến Hero','2025-05-09 10:17:52','2025-05-09 10:17:52','/images/courses/2 (1).png',1,0,'<p><span style=\"color: rgba(0, 0, 0, 0.8);\">Trong khóa này chúng ta sẽ cùng nhau xây dựng giao diện 2 trang web là The Band &amp; Shopee.</span></p>'),(39,1,'Responsive Với Grid System','2025-05-09 10:18:50','2025-05-09 10:18:50','/images/courses/3.png',1,0,'<p><span style=\"color: rgba(0, 0, 0, 0.8);\">Trong khóa này chúng ta sẽ học về cách xây dựng giao diện web responsive với Grid System, tương tự Bootstrap 4.</span></p>'),(40,2,'Lập Trình JavaScript Nâng Cao','2025-05-09 10:20:48','2025-05-09 10:20:48','/images/courses/12.png',1,0,'<p><span style=\"color: rgba(0, 0, 0, 0.8);\">Hiểu sâu hơn về cách Javascript hoạt động, tìm hiểu về IIFE, closure, reference types, this keyword, bind, call, apply, prototype, ...</span></p>'),(41,2,'Làm việc với Terminal & Ubuntu','2025-05-09 10:22:53','2025-05-09 10:22:53','/images/courses/624faac11d109.png',1,0,'<p><span style=\"color: rgba(0, 0, 0, 0.8);\">Sở hữu một Terminal hiện đại, mạnh mẽ trong tùy biến và học cách làm việc với Ubuntu là một bước quan trọng trên con đường trở thành một Web Developer.</span></p>'),(42,1,'Xây Dựng Website với ReactJS','2025-05-09 10:24:25','2025-05-09 12:12:04','/images/courses/13.png',1,0,'<p><span style=\"color: rgba(0, 0, 0, 0.8);\">Khóa học ReactJS từ cơ bản tới nâng cao, kết quả của khóa học này là bạn có thể làm hầu hết các dự án thường gặp với ReactJS. Cuối khóa học này bạn sẽ sở hữu một dự án giống Tiktok.com, bạn có thể tự tin đi xin việc khi nắm chắc các kiến thức được chia sẻ trong khóa học này.</span></p>'),(43,2,'Node & ExpressJS','2025-05-09 10:25:50','2025-05-09 10:25:50','/images/courses/6.png',1,0,'<p><span style=\"color: rgba(0, 0, 0, 0.8);\">Học Back-end với Node &amp; ExpressJS framework, hiểu các khái niệm khi làm Back-end và xây dựng RESTful API cho trang web.</span></p>'),(44,2,'Lập trình Website với Next.JS','2025-05-09 10:27:36','2025-05-09 10:27:36','/images/courses/nextjs.jpeg',1,0,'<p><span style=\"background-color: rgb(255, 255, 255); color: rgb(27, 27, 27);\">Next.js là một framework phổ biến trong việc phát triển ứng dụng web dựa trên React và được phát triển bởi Vercel.&nbsp;</span></p>');
/*!40000 ALTER TABLE `tblcourse` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblcoursedetail`
--

DROP TABLE IF EXISTS `tblcoursedetail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tblcoursedetail` (
  `id` int NOT NULL AUTO_INCREMENT,
  `isFree` tinyint(1) DEFAULT NULL,
  `price` decimal(10,0) DEFAULT NULL,
  `description` text,
  `resultsAfterStudying` text,
  `slogan` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `courseSuggestions` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `priceOld` decimal(10,0) DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `tblCourseDetail_tblCourse_FK` FOREIGN KEY (`id`) REFERENCES `tblcourse` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblcoursedetail`
--

LOCK TABLES `tblcoursedetail` WRITE;
/*!40000 ALTER TABLE `tblcoursedetail` DISABLE KEYS */;
INSERT INTO `tblcoursedetail` VALUES (3,1,NULL,'<p>Học Javascript cơ bản phù hợp cho người chưa từng học lập trình. Với hơn 100 bài học và có bài tập thực hành sau mỗi bài học.</p>',NULL,'Học mọi lúc, mọi nơi nhá',NULL,'2025-01-02 17:29:24','<blockquote>Nếu bạn chưa học HTML, CSS, vui lòng xem kỹ lộ trình học tại đây:&nbsp;<a href=\"https://fullstack.edu.vn/learning-paths\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: rgb(240, 102, 102);\"><strong>https://fullstack.edu.vn/learning-paths</strong></a></blockquote><p>Tham gia các cộng đồng để cùng học hỏi, chia sẻ và \"thám thính\" xem F8 sắp có gì mới nhé!</p><ul><li>Fanpage:&nbsp;<a href=\"https://www.facebook.com/f8vnofficial\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: rgb(255, 153, 0);\">https://www.facebook.com/f8vnofficial</a></li><li>Group:&nbsp;<a href=\"https://www.facebook.com/groups/649972919142215\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: rgb(255, 153, 0);\">https://www.facebook.com/groups/649972919142215</a></li><li>Youtube:&nbsp;<a href=\"https://www.youtube.com/F8VNOfficial\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: rgb(255, 153, 0);\">https://www.youtube.com/F8VNOfficial</a></li><li>Sơn Đặng:&nbsp;<a href=\"https://www.facebook.com/sondnf8\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: rgb(255, 153, 0);\">https://www.facebook.com/sondnf8</a></li></ul><p><br></p>',NULL),(36,1,NULL,'<ul><li>Các kiến thức cơ bản, nền móng của ngành IT</li><li>Các mô hình, kiến trúc cơ bản khi triển khai ứng dụng</li><li>Các khái niệm, thuật ngữ cốt lõi khi triển khai ứng dụng</li><li>Hiểu hơn về cách internet và máy vi tính hoạt động</li></ul><p><br></p>',NULL,'Học mọi lúc, mọi nơi','2025-05-09 10:14:58','2025-05-09 10:14:58',NULL,NULL),(37,1,NULL,NULL,NULL,'Học mọi lúc, mọi nơi','2025-05-09 10:16:34','2025-05-09 10:16:34',NULL,NULL),(38,1,NULL,'<p><br></p>',NULL,'Học mọi lúc, mọi nơi','2025-05-09 10:17:52','2025-05-09 10:17:52',NULL,NULL),(39,1,NULL,NULL,NULL,'Học mọi lúc, mọi nơi','2025-05-09 10:18:50','2025-05-09 10:18:50',NULL,NULL),(40,0,999000,'<ul><li>Được học kiến thức miễn phí với nội dung chất lượng hơn mất phí</li><li>Các kiến thức nâng cao của Javascript giúp code trở nên tối ưu hơn</li><li>Hiểu được cách tư duy nâng cao của các lập trình viên có kinh nghiệm</li><li>Hiểu được các khái niệm khó như từ khóa this, phương thức bind, call, apply &amp; xử lý bất đồng bộ</li><li>Có nền tảng Javascript vững chắc để làm việc với mọi thư viện, framework viết bởi Javascript</li><li>Nâng cao cơ hội thành công khi phỏng vấn xin việc nhờ kiến thức chuyên môn vững chắc</li></ul><p><br></p>',NULL,'Học mọi lúc, mọi nơi','2025-05-09 10:20:48','2025-05-09 10:20:48',NULL,1290000),(41,0,499000,'<ul><li>Biết cách cài đặt và tùy biến Windows Terminal</li><li>Biết sử dụng Windows Subsystem for Linux</li><li>Thành thạo sử dụng các lệnh Linux/Ubuntu</li><li>Biết cài đặt Node và tạo dự án ReactJS/ExpressJS</li><li>Biết cài đặt PHP 7.4 và MariaDB trên Ubuntu 20.04</li><li>Hiểu về Ubuntu và biết tự cài đặt các phần mềm khác</li></ul><p><br></p><p><br></p>',NULL,'Học mọi lúc, mọi nơi','2025-05-09 10:22:53','2025-05-09 10:22:53',NULL,999000),(42,0,1499000,'<ul><li>Hiểu về khái niệm SPA/MPA</li><li>Hiểu về khái niệm hooks</li><li>Hiểu cách ReactJS hoạt động</li><li>Hiểu về function/class component</li><li>Biết cách tối ưu hiệu năng ứng dụng</li><li>Thành thạo làm việc với RESTful API</li><li>Hiểu rõ ràng Redux workflow</li><li>Thành thạo sử dụng Redux vào dự án</li><li>Biết sử dụng redux-thunk middleware</li><li>Xây dựng sản phẩm thực tế (clone Tiktok)</li><li>Triển khai dự án React ra Internet</li><li>Đủ hành trang tự tin apply đi xin việc</li><li>Biết cách Deploy lên Github/Gitlab page</li><li>Nhận chứng chỉ khóa học do F8 cấp</li></ul>',NULL,'Học mọi lúc, mọi nơi','2025-05-09 10:24:25','2025-05-09 12:12:04',NULL,2199000),(43,0,1499000,NULL,NULL,'Học mọi lúc, mọi nơi','2025-05-09 10:25:50','2025-05-09 10:25:50',NULL,999000),(44,0,2199000,NULL,NULL,'Học mọi lúc, mọi nơi','2025-05-09 10:27:36','2025-05-09 10:27:36',NULL,1499000);
/*!40000 ALTER TABLE `tblcoursedetail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblEnrollments`
--

DROP TABLE IF EXISTS `tblEnrollments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tblEnrollments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `course_id` int NOT NULL,
  `enrolled_at` datetime DEFAULT NULL,
  `order_id` int DEFAULT NULL,
  `isFree` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `course_id` (`course_id`),
  KEY `tblEnrollments_tblOrders_FK` (`order_id`),
  CONSTRAINT `tblEnrollments_tblOrders_FK` FOREIGN KEY (`order_id`) REFERENCES `tblOrders` (`id`),
  CONSTRAINT `tblUserCourses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `tbluser` (`Id`),
  CONSTRAINT `tblUserCourses_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `tblcourse` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblEnrollments`
--

LOCK TABLES `tblEnrollments` WRITE;
/*!40000 ALTER TABLE `tblEnrollments` DISABLE KEYS */;
INSERT INTO `tblEnrollments` VALUES (44,36,3,'2025-06-02 00:34:29',NULL,1),(45,32,3,'2025-06-04 15:57:54',NULL,1);
/*!40000 ALTER TABLE `tblEnrollments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblFriendRequests`
--

DROP TABLE IF EXISTS `tblFriendRequests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tblFriendRequests` (
  `sender_id` int NOT NULL,
  `receiver_id` int NOT NULL,
  `status` enum('pending','accepted','rejected') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`sender_id`,`receiver_id`),
  KEY `tblFriendRequests_tbluser_FK_1` (`receiver_id`),
  CONSTRAINT `tblFriendRequests_tbluser_FK` FOREIGN KEY (`sender_id`) REFERENCES `tbluser` (`Id`),
  CONSTRAINT `tblFriendRequests_tbluser_FK_1` FOREIGN KEY (`receiver_id`) REFERENCES `tbluser` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblFriendRequests`
--

LOCK TABLES `tblFriendRequests` WRITE;
/*!40000 ALTER TABLE `tblFriendRequests` DISABLE KEYS */;
INSERT INTO `tblFriendRequests` VALUES (32,36,'pending','2025-05-08 16:04:08'),(32,41,'pending','2025-05-02 22:07:05'),(54,36,'pending','2025-05-03 13:31:23'),(55,36,'pending','2025-05-03 13:31:23'),(56,32,'pending','2025-05-03 13:31:23'),(57,32,'pending','2025-05-03 13:31:23'),(59,32,'pending','2025-05-03 13:31:23'),(68,36,'pending','2025-05-03 13:35:44'),(71,32,'pending','2025-05-02 22:07:05'),(87,36,'pending','2025-05-03 13:35:44'),(88,32,'accepted','2025-05-03 13:36:00'),(89,32,NULL,'2025-05-03 21:56:49');
/*!40000 ALTER TABLE `tblFriendRequests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblFriends`
--

DROP TABLE IF EXISTS `tblFriends`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tblFriends` (
  `user_id` int NOT NULL,
  `friend_id` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`,`friend_id`),
  KEY `tblFriends_tbluser_FK_1` (`friend_id`),
  CONSTRAINT `tblFriends_tbluser_FK` FOREIGN KEY (`user_id`) REFERENCES `tbluser` (`Id`),
  CONSTRAINT `tblFriends_tbluser_FK_1` FOREIGN KEY (`friend_id`) REFERENCES `tbluser` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblFriends`
--

LOCK TABLES `tblFriends` WRITE;
/*!40000 ALTER TABLE `tblFriends` DISABLE KEYS */;
INSERT INTO `tblFriends` VALUES (32,88,'2025-05-03 13:40:36'),(59,36,'2025-05-03 22:02:18'),(70,36,'2025-05-03 22:02:18'),(86,32,'2025-05-03 22:01:42'),(86,36,'2025-05-03 22:02:18'),(87,32,'2025-05-03 22:01:42'),(87,36,'2025-05-03 22:02:18'),(88,36,'2025-05-03 13:40:36'),(89,32,'2025-05-03 22:01:42'),(89,36,'2025-05-03 22:02:18');
/*!40000 ALTER TABLE `tblFriends` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbllanguagecode`
--

DROP TABLE IF EXISTS `tbllanguagecode`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbllanguagecode` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `dateCreate` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbllanguagecode`
--

LOCK TABLES `tbllanguagecode` WRITE;
/*!40000 ALTER TABLE `tbllanguagecode` DISABLE KEYS */;
INSERT INTO `tbllanguagecode` VALUES (1,'JavaScript','2024-12-16 10:28:50'),(2,'C++','2024-12-16 10:28:50'),(3,'HTML & CSS','2024-12-16 10:28:50');
/*!40000 ALTER TABLE `tbllanguagecode` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblLearningpathCourse`
--

DROP TABLE IF EXISTS `tblLearningpathCourse`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tblLearningpathCourse` (
  `learning_path_step_id` int NOT NULL,
  `CourseId` int NOT NULL,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `order_index` int DEFAULT NULL,
  PRIMARY KEY (`learning_path_step_id`,`CourseId`),
  KEY `tblLearningpathCourse_tblcourse_FK` (`CourseId`),
  CONSTRAINT `tblLearningpathCourse_tblcourse_FK` FOREIGN KEY (`CourseId`) REFERENCES `tblcourse` (`id`),
  CONSTRAINT `tblLearningpathCourse_tblLearningPathStep_FK` FOREIGN KEY (`learning_path_step_id`) REFERENCES `tblLearningPathStep` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblLearningpathCourse`
--

LOCK TABLES `tblLearningpathCourse` WRITE;
/*!40000 ALTER TABLE `tblLearningpathCourse` DISABLE KEYS */;
/*!40000 ALTER TABLE `tblLearningpathCourse` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblLearningPaths`
--

DROP TABLE IF EXISTS `tblLearningPaths`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tblLearningPaths` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `Level` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `estimatedTime` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `Status` tinyint DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblLearningPaths`
--

LOCK TABLES `tblLearningPaths` WRITE;
/*!40000 ALTER TABLE `tblLearningPaths` DISABLE KEYS */;
INSERT INTO `tblLearningPaths` VALUES (1,'Lộ trình Frontend','Hầu hết các websites hoặc ứng dụng di động đều có 2 phần là Front-end và Back-end. Front-end là phần giao diện người dùng nhìn thấy và có thể tương tác, đó chính là các ứng dụng mobile hay những website bạn đã từng sử dụng. Vì vậy, nhiệm vụ của lập trình viên Front-end là xây dựng các giao diện đẹp, dễ sử dụng và tối ưu trải nghiệm người dùng.\n\nTại Việt Nam, lương trung bình cho lập trình viên front-end vào khoảng 16.000.000đ / tháng.\n\nDưới đây là các khóa học F8 đã tạo ra dành cho bất cứ ai theo đuổi sự nghiệp trở thành một lập trình viên Front-end.\n\nCác khóa học có thể chưa đầy đủ, F8 vẫn đang nỗ lực hoàn thiện trong thời gian sớm nhất.','/images/path/fontend_path.png','beginner',30,'2025-04-22 10:00:04','2025-04-23 07:42:52',1),(2,'Lộ trình Backend','Học C#, .NET, Database để thành backend developer chuyên nghiệp','/images/path/backend_path.png','intermediate',40,'2025-04-22 10:00:04','2025-04-23 07:42:22',1),(3,'Lộ trình Fullstack','Kết hợp cả frontend và backend, dùng React + .NET Core','/images/path/fullstack_path.png','advanced',60,'2025-04-22 10:00:04','2025-04-23 07:42:22',1),(4,'Lộ trình AI','Học Python, Machine Learning, và các thư viện như TensorFlow, PyTorch','/images/path/ai_path.png','intermediate',45,'2025-04-22 10:00:04','2025-04-23 07:42:22',1);
/*!40000 ALTER TABLE `tblLearningPaths` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblLearningPathStep`
--

DROP TABLE IF EXISTS `tblLearningPathStep`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tblLearningPathStep` (
  `learning_path_id` int NOT NULL,
  `order_index` int DEFAULT NULL,
  `step_id` int NOT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`),
  KEY `tblLearningPathStep_tblLearningPaths_FK` (`learning_path_id`),
  KEY `tblLearningPathStep_tblSteps_FK` (`step_id`),
  CONSTRAINT `tblLearningPathStep_tblLearningPaths_FK` FOREIGN KEY (`learning_path_id`) REFERENCES `tblLearningPaths` (`id`),
  CONSTRAINT `tblLearningPathStep_tblSteps_FK` FOREIGN KEY (`step_id`) REFERENCES `tblSteps` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblLearningPathStep`
--

LOCK TABLES `tblLearningPathStep` WRITE;
/*!40000 ALTER TABLE `tblLearningPathStep` DISABLE KEYS */;
INSERT INTO `tblLearningPathStep` VALUES (1,1,13,1),(1,2,1,2),(1,3,3,3),(1,4,4,4),(1,5,5,5);
/*!40000 ALTER TABLE `tblLearningPathStep` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbllecturedetails`
--

DROP TABLE IF EXISTS `tbllecturedetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbllecturedetails` (
  `id` int NOT NULL AUTO_INCREMENT,
  `lessonGroup` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `level` int DEFAULT NULL,
  `lessonTypeId` int NOT NULL,
  `courseId` int DEFAULT NULL,
  `title` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `lessonGroup` (`lessonGroup`),
  KEY `tblLectureDetails_LessonType_FK` (`lessonTypeId`),
  KEY `tblLectureDetails_tblCourse_FK` (`courseId`),
  CONSTRAINT `tblLectureDetails_ibfk_1` FOREIGN KEY (`lessonGroup`) REFERENCES `tbllessongroup` (`id`),
  CONSTRAINT `tblLectureDetails_LessonType_FK` FOREIGN KEY (`lessonTypeId`) REFERENCES `lessontype` (`id`),
  CONSTRAINT `tblLectureDetails_tblCourse_FK` FOREIGN KEY (`courseId`) REFERENCES `tblcourse` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbllecturedetails`
--

LOCK TABLES `tbllecturedetails` WRITE;
/*!40000 ALTER TABLE `tbllecturedetails` DISABLE KEYS */;
INSERT INTO `tbllecturedetails` VALUES (32,26,'2024-11-08 23:01:27','2024-11-08 23:01:27',1,1,3,'Xử lý báo lỗi cơ bản'),(33,1,'2024-11-10 04:03:37','2024-11-10 04:03:37',2,1,3,'Lời khuyên trước khóa học'),(34,1,'2024-11-10 19:18:20','2024-11-10 19:18:20',3,1,3,'Javascript có thể làm được gì?'),(35,1,'2024-11-10 19:19:36','2024-11-10 19:19:36',4,1,3,'Cài đặt môi trường'),(48,1,'2024-11-13 07:20:58','2024-11-13 07:20:58',7,4,3,'Tham gia cộng đồng F8 trên Discord'),(49,1,'2024-11-15 10:46:37','2024-11-15 10:46:37',8,3,3,'Ôn tập toán tử so sánh'),(50,14,'2024-11-15 13:04:33','2024-11-15 13:04:33',9,3,3,'Ôn lại kiến thức về hàm'),(51,2,'2024-12-13 12:46:02','2024-12-13 12:46:02',10,1,3,'Sử dụng JavaScript với HTML'),(52,2,'2024-12-13 13:22:41','2024-12-13 13:22:41',11,4,3,'Làm quen với màn thử thách'),(53,2,'2024-12-13 13:23:26','2024-12-13 13:23:26',12,4,3,'Lưu ý khi học lập trình tại F8'),(54,2,'2024-12-22 15:17:11','2024-12-22 15:17:11',1,2,3,'Bắt đầu với một thử thách nhỏ'),(55,2,'2024-12-29 08:21:41','2024-12-29 08:21:41',13,1,3,'Khái niệm biến và cách sử dụng'),(57,14,'2025-01-01 11:40:59','2025-01-01 11:40:59',14,2,3,'Thực hành tạo hàm sum #1'),(58,1,'2025-01-01 14:04:00','2025-01-01 14:04:00',15,2,3,'Thực hành sử dụng Spread'),(59,31,'2025-05-09 12:22:13','2025-05-09 12:22:13',1,1,42,'ReactJS là gì? Tại sao nên học ReactJS?'),(60,31,'2025-05-09 12:23:05','2025-05-09 12:23:05',2,1,42,'SPA/MPA là gì?'),(61,31,'2025-05-09 12:24:45','2025-05-09 12:24:45',3,3,42,'Ưu điểm của SPA');
/*!40000 ALTER TABLE `tbllecturedetails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbllesson`
--

DROP TABLE IF EXISTS `tbllesson`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbllesson` (
  `id` int NOT NULL AUTO_INCREMENT,
  `videoLink` varchar(355) DEFAULT NULL,
  `description` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `duration` bigint DEFAULT '0',
  PRIMARY KEY (`id`),
  CONSTRAINT `tblLesson_ibfk_1` FOREIGN KEY (`id`) REFERENCES `tbllecturedetails` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbllesson`
--

LOCK TABLES `tbllesson` WRITE;
/*!40000 ALTER TABLE `tbllesson` DISABLE KEYS */;
INSERT INTO `tbllesson` VALUES (32,'https://www.youtube.com/watch?v=ZdvRm1bfGAk&t=785s','<p>Xử lý báo lỗi cơ bản</p><p><br></p>','2024-11-08 23:01:27','2024-11-08 23:01:27',2478),(33,'https://www.youtube.com/watch?v=-jV06pqjUUc&t=1s','<p><span style=\"background-color: rgba(255, 255, 255, 0.1);\">Chào các bạn, video thứ 2 này là chia sẻ của mình tới các bạn về những lưu ý và lời khuyên trước khóa học | Lộ trình khóa học JavaScript cơ bản tại F8</span></p><p><a href=\"https://www.youtube.com/hashtag/hoclaptrinh\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"background-color: rgba(255, 255, 255, 0.1); color: inherit;\">#hoclaptrinh</a><span style=\"background-color: rgba(255, 255, 255, 0.1); color: rgb(255, 255, 255);\">  </span><a href=\"https://www.youtube.com/hashtag/hoclaptrinhmienphi\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"background-color: rgba(255, 255, 255, 0.1); color: inherit;\">#hoclaptrinhmienphi</a><span style=\"background-color: rgba(255, 255, 255, 0.1); color: rgb(255, 255, 255);\">  </span><a href=\"https://www.youtube.com/hashtag/javascript\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"background-color: rgba(255, 255, 255, 0.1); color: inherit;\">#javascript</a><span style=\"background-color: rgba(255, 255, 255, 0.1); color: rgb(255, 255, 255);\">  </span><a href=\"https://www.youtube.com/hashtag/frontend\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"background-color: rgba(255, 255, 255, 0.1); color: inherit;\">#frontend</a><span style=\"background-color: rgba(255, 255, 255, 0.1); color: rgb(255, 255, 255);\">  </span><a href=\"https://www.youtube.com/hashtag/backend\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"background-color: rgba(255, 255, 255, 0.1); color: inherit;\">#backend</a><span style=\"background-color: rgba(255, 255, 255, 0.1); color: rgb(255, 255, 255);\">  </span><a href=\"https://www.youtube.com/hashtag/devops\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"background-color: rgba(255, 255, 255, 0.1); color: inherit;\">#devops</a><span style=\"background-color: rgba(255, 255, 255, 0.1); color: rgb(255, 255, 255);\">  </span><a href=\"https://www.youtube.com/hashtag/f8\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"background-color: rgba(255, 255, 255, 0.1); color: inherit;\">#f8</a></p>','2024-11-10 04:03:38','2024-11-10 04:03:38',260),(34,'https://www.youtube.com/watch?v=0SJE9dYdpps&list=PL_-VfJajZj0VgpFpEVFzS5Z-lkXtBe-x5','<p><strong>Javascript có thể làm được gì? Giới thiệu về trang F8 | Học lập trình Javascript cơ bản</strong></p>','2024-11-10 19:18:21','2024-11-10 19:18:21',473),(35,'https://www.youtube.com/watch?v=efI98nT8Ffo&list=PL_-VfJajZj0VgpFpEVFzS5Z-lkXtBe-x5','<p><span style=\"background-color: rgba(255, 255, 255, 0.1);\">Video này mình sẽ hướng dẫn các bạn cài đặt môi trường, công cụ phù hợp để học JavaScript</span></p><p><a href=\"https://www.youtube.com/hashtag/hoclaptrinh\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"background-color: rgba(255, 255, 255, 0.1); color: inherit;\">#hoclaptrinh</a><span style=\"background-color: rgba(255, 255, 255, 0.1); color: rgb(255, 255, 255);\">  </span><a href=\"https://www.youtube.com/hashtag/hoclaptrinhmienphi\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"background-color: rgba(255, 255, 255, 0.1); color: inherit;\">#hoclaptrinhmienphi</a><span style=\"background-color: rgba(255, 255, 255, 0.1); color: rgb(255, 255, 255);\">  </span><a href=\"https://www.youtube.com/hashtag/javascript\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"background-color: rgba(255, 255, 255, 0.1); color: inherit;\">#javascript</a><span style=\"background-color: rgba(255, 255, 255, 0.1); color: rgb(255, 255, 255);\">  </span><a href=\"https://www.youtube.com/hashtag/frontend\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"background-color: rgba(255, 255, 255, 0.1); color: inherit;\">#frontend</a><span style=\"background-color: rgba(255, 255, 255, 0.1); color: rgb(255, 255, 255);\">  </span><a href=\"https://www.youtube.com/hashtag/backend\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"background-color: rgba(255, 255, 255, 0.1); color: inherit;\">#backend</a><span style=\"background-color: rgba(255, 255, 255, 0.1); color: rgb(255, 255, 255);\">  </span><a href=\"https://www.youtube.com/hashtag/devops\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"background-color: rgba(255, 255, 255, 0.1); color: inherit;\">#devops</a><span style=\"background-color: rgba(255, 255, 255, 0.1); color: rgb(255, 255, 255);\">  </span><a href=\"https://www.youtube.com/hashtag/f8\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"background-color: rgba(255, 255, 255, 0.1); color: inherit;\">#f8</a></p>','2024-11-10 19:19:37','2024-11-10 19:19:37',128),(51,'https://www.youtube.com/watch?v=W0vEUmyvthQ&t=1s','<h2>Cách Internal (sử dụng nội bộ)</h2><p>Đặt trực tiếp cặp thẻ&nbsp;<span style=\"background-color: var(--prism-inline-code-bg, #c9fffc); color: var(--prism-inline-code-color);\">script</span>&nbsp;vào mã HTML và viết&nbsp;<span style=\"background-color: var(--prism-inline-code-bg, #c9fffc); color: var(--prism-inline-code-color);\">javascript</span>&nbsp;giữa cặp thẻ này.</p><pre class=\"ql-syntax\" spellcheck=\"false\">&lt;body&gt;\n    ...\n    &lt;script&gt;\n        alert(\'Xin chào các bạn!\')\n    &lt;/script&gt;\n    ...\n&lt;/body&gt;\n</pre><p><br></p><h2>Cách External (sử dụng file .js bên ngoài)</h2><p>Các bạn sẽ thường thấy cách này được sử dụng vì mã&nbsp;<span style=\"background-color: var(--prism-inline-code-bg, #c9fffc); color: var(--prism-inline-code-color);\">javascript</span>&nbsp;được viết riêng biệt ra một file&nbsp;<span style=\"background-color: var(--prism-inline-code-bg, #c9fffc); color: var(--prism-inline-code-color);\">.js</span>&nbsp;ở bên ngoài. Mã của chúng ta sẽ gọn gàng, dễ nhìn, dễ chỉnh sửa hơn vì không bị viết lẫn lộn vào HTML như cách&nbsp;<span style=\"background-color: var(--prism-inline-code-bg, #c9fffc); color: var(--prism-inline-code-color);\">Internal</span>.</p><pre class=\"ql-syntax\" spellcheck=\"false\">&lt;body&gt;\n    ...\n    &lt;script src=\"đường_dẫn_tới_file.js\"&gt;&lt;/script&gt;\n&lt;/body&gt;\n</pre><p><br></p><p>Trong trường hợp sử dụng file&nbsp;<span style=\"background-color: var(--prism-inline-code-bg, #c9fffc); color: var(--prism-inline-code-color);\">.js</span>&nbsp;thì nội dung của file không được chứa thẻ&nbsp;<span style=\"background-color: var(--prism-inline-code-bg, #c9fffc); color: var(--prism-inline-code-color);\">&lt;script&gt;</span>. Sau đây là ví dụ nội dung file&nbsp;<span style=\"background-color: var(--prism-inline-code-bg, #c9fffc); color: var(--prism-inline-code-color);\">.js</span>.</p><h3>Đúng</h3><pre class=\"ql-syntax\" spellcheck=\"false\">// Nội dung file .js\nalert(\'Xin chào các bạn!\')\n</pre><p><br></p><h3>Sai</h3><pre class=\"ql-syntax\" spellcheck=\"false\">// Nội dung file .js\n&lt;script&gt;\n    alert(\'Xin chào các bạn!\')\n&lt;/script&gt;\n</pre><p><br></p><blockquote>Trong thực tế cách&nbsp;<span style=\"background-color: var(--prism-inline-code-bg, #c9fffc); color: var(--prism-inline-code-color);\">Internal</span>&nbsp;cũng được sử dụng khá phổ biến trong các trường hợp mã&nbsp;<span style=\"background-color: var(--prism-inline-code-bg, #c9fffc); color: var(--prism-inline-code-color);\">javascript</span>&nbsp;đó chỉ sử dụng tại duy nhất một màn hình và số lượng các dòng code không nhiều. Tuy nhiên cách này các bạn nên tránh việc lạm dụng vì sẽ dễ gây rác source code và lặp lại code không mong muốn.</blockquote><p><br></p>','2024-12-13 12:46:02','2024-12-13 12:46:02',273),(55,'https://www.youtube.com/watch?v=CLbx37dqYEI&t','<h2>Biến là gì?</h2><p>Trong quá trình xây dựng website hoặc các ứng dụng với Javascript chúng ta sẽ cần phải làm việc với các dạng thông tin dữ liệu khác nhau. Ví dụ:</p><ol><li>Phần mềm kế toán - Chúng ta sẽ làm việc với những con số</li><li>Website bán hàng - Làm việc với dữ liệu thông tin sản phẩm, đơn hàng và giỏ hàng</li><li>Ứng dụng Chat - Dữ liệu là những đoạn chat, tin nhắn, thông tin người chat</li></ol><p>Biến được sử dụng để lưu trữ các thông tin trên trong quá trình ứng dụng Javascript hoạt động.</p><h2>Khai báo biến</h2><p>Để khai báo biến ta sẽ bắt đầu bằng từ khóa&nbsp;<span style=\"background-color: var(--prism-inline-code-bg, #c9fffc); color: var(--prism-inline-code-color);\">var</span>&nbsp;(var là viết tắt của từ&nbsp;<span style=\"background-color: var(--prism-inline-code-bg, #c9fffc); color: var(--prism-inline-code-color);\">variable</span>&nbsp;- nghĩa là biến). Khai báo biến có cú pháp như sau:</p><pre class=\"ql-syntax\" spellcheck=\"false\">var [dấu cách] [tên biến];\n</pre><p><br></p><p>Theo cú pháp trên, mình sẽ định nghĩa một biến có tên là&nbsp;<span style=\"background-color: var(--prism-inline-code-bg, #c9fffc); color: var(--prism-inline-code-color);\">fullName</span>&nbsp;với dự định để lưu tên đầy đủ của mình vào đó.</p><pre class=\"ql-syntax\" spellcheck=\"false\">var fullName;\n</pre><p><br></p><p>Tiếp theo, ta có thể lưu thông tin vào biến&nbsp;<span style=\"background-color: var(--prism-inline-code-bg, #c9fffc); color: var(--prism-inline-code-color);\">fullName</span>&nbsp;này:</p><pre class=\"ql-syntax\" spellcheck=\"false\">var fullName; // khai báo biến\n\nfullName = \'Sơn Đặng\'; // gán giá trị\n</pre><p><br></p><p>Các bạn chú ý có dấu nháy đơn&nbsp;<span style=\"background-color: var(--prism-inline-code-bg, #c9fffc); color: var(--prism-inline-code-color);\">\'\'</span>&nbsp;bao ngoài chữ&nbsp;<span style=\"background-color: var(--prism-inline-code-bg, #c9fffc); color: var(--prism-inline-code-color);\">Sơn Đặng</span>. Đó là cách để thể hiện dữ liệu dạng&nbsp;<span style=\"background-color: var(--prism-inline-code-bg, #c9fffc); color: var(--prism-inline-code-color);\">chuỗi</span>&nbsp;(văn bản) trong Javascript.</p><blockquote>Khi đoạn mã trên được chạy (thực thi) Javascript sẽ tạo biến với tên&nbsp;<span style=\"background-color: var(--prism-inline-code-bg, #c9fffc); color: var(--prism-inline-code-color);\">fullName</span>&nbsp;và gán giá trị&nbsp;<span style=\"background-color: var(--prism-inline-code-bg, #c9fffc); color: var(--prism-inline-code-color);\">\'Sơn Đặng\'</span>&nbsp;cho biến này. Một vùng nhớ trong RAM của máy tính sẽ được sử dụng để phục vụ việc lưu trữ những giá trị của biến khi chương trình được thực thi.</blockquote><p>Chuỗi&nbsp;<span style=\"background-color: var(--prism-inline-code-bg, #c9fffc); color: var(--prism-inline-code-color);\">\'Sơn Đặng\'</span>&nbsp;đã được lưu vào vùng nhớ tương ứng với biến&nbsp;<span style=\"background-color: var(--prism-inline-code-bg, #c9fffc); color: var(--prism-inline-code-color);\">fullName</span>. Ta có thể truy cập tới chuỗi này qua tên biến:</p><pre class=\"ql-syntax\" spellcheck=\"false\">var fullName;\n\nfullName = \'Sơn Đặng\';\n\nalert(fullName); // hiển thị giá trị của biến\n</pre><p><br></p><p>Để đơn giản và ngắn gọn, ta có thể kết hợp việc khai báo biến và gán giá trị cho biến thành một dòng:</p><pre class=\"ql-syntax\" spellcheck=\"false\">var fullName = \'Sơn Đặng\'; // khai báo và gán giá trị\n\nalert(fullName);\n</pre><p><br></p><p>Ta cũng có thể khai báo nhiều biến trong cùng một dòng cách nhau bởi dấu&nbsp;<span style=\"background-color: var(--prism-inline-code-bg, #c9fffc); color: var(--prism-inline-code-color);\">,</span>&nbsp;như sau:</p><pre class=\"ql-syntax\" spellcheck=\"false\">var fullName = \'Sơn Đặng\', age = 18, workAt = \'F8\';\n</pre><p><br></p><p>Trông có vẻ ngắn gọn, tuy nhiên mình khuyên các bạn không nên dùng cách này. Khi cần khai báo nhiều biến hơn thì cách này trở nên rất khó đọc.</p><p><br></p><p>Ta nên khai báo biến trên mỗi dòng khác nhau để dễ đọc hơn (nên dùng cách này):</p><pre class=\"ql-syntax\" spellcheck=\"false\">var fullName = \'Sơn Đặng\';\nvar age = 18;\nvar workAt = \'F8\';\n</pre><p><br></p><p>Một số cách khai báo biến trên nhiều dòng khác như sau:</p><pre class=\"ql-syntax\" spellcheck=\"false\">var fullName = \'Sơn Đặng\',\n    age = 18,\n    workAt = \'F8\';\n</pre><p><br></p><p>Thậm chí có cả phong cách sau:</p><pre class=\"ql-syntax\" spellcheck=\"false\">var fullName = \'Sơn Đặng\'\n    , age = 18\n    , workAt = \'F8\';\n</pre><p><br></p><p>Về mặt kỹ thuật thì tất cả các cách đều tương tự nhau. Vì vậy dùng cách nào là tùy theo sở thích của bạn.</p><blockquote>Khi gán giá trị dạng số cho biến chúng ta không sử dụng dấu nháy đơn&nbsp;<span style=\"background-color: var(--prism-inline-code-bg, #c9fffc); color: var(--prism-inline-code-color);\">\'\'</span>&nbsp;bao bọc bên ngoài. Như ví dụ trên thì&nbsp;<span style=\"background-color: var(--prism-inline-code-bg, #c9fffc); color: var(--prism-inline-code-color);\">age = 18</span>&nbsp;ta sẽ viết luôn là số&nbsp;<span style=\"background-color: var(--prism-inline-code-bg, #c9fffc); color: var(--prism-inline-code-color);\">18</span>&nbsp;và không sử dụng dấu nháy.</blockquote><h2>Quy tắc đặt tên</h2><ol><li>Tên biến có thể bao gồm chữ cái, số, dấu gạch dưới ( _ ) và kí tự đô la ( $ )</li><li>Tên biến không thể bắt đầu bằng số, phải bắt đầu bằng một chữ cái hoặc dấu gạch dưới hoặc dấu đô la</li><li>Tên biến phân biệt chữ hoa và chữ thường. Vì vậy&nbsp;<span style=\"background-color: var(--prism-inline-code-bg, #c9fffc); color: var(--prism-inline-code-color);\">tenbien</span>&nbsp;và&nbsp;<span style=\"background-color: var(--prism-inline-code-bg, #c9fffc); color: var(--prism-inline-code-color);\">TenBien</span>&nbsp;là 2 biến khác nhau</li><li>Tên biến không được (không thể) đặt trùng với các từ khóa của Javascript</li></ol><blockquote>Từ khóa là những từ được Javascript sử dụng để tạo nên những quy chuẩn về mặt chức năng và cú pháp trong Javascript. Ví dụ: Để khai báo một biến ta sẽ sử dụng từ khóa&nbsp;<span style=\"background-color: var(--prism-inline-code-bg, #c9fffc); color: var(--prism-inline-code-color);\">var</span>. Vì vậy ta không thể đặt tên biến là \"var\"</blockquote><h4>Ví dụ cho tên biến hợp lệ</h4><pre class=\"ql-syntax\" spellcheck=\"false\">var address; // tên biến sử dụng chữ cái\n\nvar first_name; // kết hợp chữ cái và gạch dưới\n\nvar $last_name; // dấu đô la, gạch dưới và chữ cái\n\nvar f8; // chữ cái và số, số đứng sau chữ cái\n</pre><p><br></p><h4>Ví dụ cho tên biến không hợp lệ</h4><pre class=\"ql-syntax\" spellcheck=\"false\">var java-script; // bao gồm dấu gạch ngang\n\nvar 8f; // bắt đầu với chữ số\n\nvar var = \'Biến\'; // sử dụng trùng từ khóa `var`\n</pre><p><br></p><p>Các chữ cái không phải tiếng Lating vẫn có thể được sử dụng làm tên biến (không sử dụng cách này):</p><pre class=\"ql-syntax\" spellcheck=\"false\">var ດ້ານວິຊາການ = \'...\'; // tiếng Pháp\nvar ਤਕਨੀਕੀ = \'...\'; // tiếng Lào\n</pre><p><br></p><blockquote>Trong thực tế chúng ta sẽ sử dụng tiếng Anh để đặt tên biến vì đó là quy ước chung Quốc Tế.</blockquote><h2>Gán giá trị cho biến</h2><p>Các bạn hãy tưởng tượng biến như một chiếc hộp và giá trị gán cho biến như là đồ vật được bỏ vào hộp. Vì vậy ta có thể đặt bất cứ giá trị gì vào hộp và ta cũng có thể thay thế chúng nếu muốn:</p><pre class=\"ql-syntax\" spellcheck=\"false\">var fullName; // tạo chiếc hộp\n\nfullName = \'Sơn Đặng\'; // cho đồ vật vào hộp\n\nfullName = \'Nguyễn Văn A\'; // thay thế đồ vật khác\n\nalert(fullName); // Nguyễn Văn A\n</pre><p><br></p><blockquote>Khi giá trị của biến được thay đổi, giá trị cũ sẽ bị xóa khỏi biến.</blockquote><p>Ta cũng có thể sao chép giá trị từ biến này sang biến khác:</p><pre class=\"ql-syntax\" spellcheck=\"false\">var currentCourse = \'Javascript\';\n\nvar newCourse;\n\n// copy giá trị \'Javascript\' từ biến\n// \'currentCourse\' sang biến \'newCourse\'\nnewCourse = currentCourse;\n\n// bây giờ, biến \'newCourse\' và \'currentCourse\'\n// đều có giá trị là \'Javascript\'\n\nalert(currentCourse); // Javascript\n\nalert(newCourse); // Javascript\n</pre><p><br></p><blockquote>Có thể bạn chưa biết có những ngôn ngữ lập trình như&nbsp;<span style=\"background-color: var(--prism-inline-code-bg, #c9fffc); color: var(--prism-inline-code-color);\">Scala</span>,&nbsp;<span style=\"background-color: var(--prism-inline-code-bg, #c9fffc); color: var(--prism-inline-code-color);\">Erlang</span>&nbsp;không cho phép thay đổi giá trị của biến đã định nghĩa. Ta bắt buộc phải tạo biến mới khi cần lưu giá trị và không thể gán lại giá trị cho biến cũ.</blockquote><h2>Đặt tên biến như nào cho đúng?</h2><p>Đặt tên biến hợp lệ theo quy tắc của Javascript là việc đơn giản, tuy nhiên trong thực tế đặt tên biến không chỉ dừng lại ở việc đặt cho hợp lệ mà ta còn phải quan tâm tới các yếu tố khác như:</p><ol><li>Tên biến phải có ý nghĩa cụ thể, phải rõ ràng và thể hiện được nó đang lưu trữ cái gì.</li><li>Sử dụng tiếng Anh để đặt tên biến, sử dụng các từ có thể đọc lên được như&nbsp;<span style=\"background-color: var(--prism-inline-code-bg, #c9fffc); color: var(--prism-inline-code-color);\">userName</span>,&nbsp;<span style=\"background-color: var(--prism-inline-code-bg, #c9fffc); color: var(--prism-inline-code-color);\">phoneNumber</span>,&nbsp;<span style=\"background-color: var(--prism-inline-code-bg, #c9fffc); color: var(--prism-inline-code-color);\">verifyEmail</span>, ..</li><li>Tránh đặt tên biến ngắn như&nbsp;<span style=\"background-color: var(--prism-inline-code-bg, #c9fffc); color: var(--prism-inline-code-color);\">a</span>,&nbsp;<span style=\"background-color: var(--prism-inline-code-bg, #c9fffc); color: var(--prism-inline-code-color);\">b</span>,&nbsp;<span style=\"background-color: var(--prism-inline-code-bg, #c9fffc); color: var(--prism-inline-code-color);\">p</span>&nbsp;trừ khi bạn chỉ đang làm ví dụ hoặc bạn thật sự hiểu trường hợp đó có thể đặt tên như vậy.</li><li>Tránh đặt tên biến chung chung kiểu như&nbsp;<span style=\"background-color: var(--prism-inline-code-bg, #c9fffc); color: var(--prism-inline-code-color);\">data</span>,&nbsp;<span style=\"background-color: var(--prism-inline-code-bg, #c9fffc); color: var(--prism-inline-code-color);\">value</span>. Vì khi nhìn vào không thể hiểu&nbsp;<span style=\"background-color: var(--prism-inline-code-bg, #c9fffc); color: var(--prism-inline-code-color);\">data</span>&nbsp;là&nbsp;<span style=\"background-color: var(--prism-inline-code-bg, #c9fffc); color: var(--prism-inline-code-color);\">data</span>&nbsp;của cái gì,&nbsp;<span style=\"background-color: var(--prism-inline-code-bg, #c9fffc); color: var(--prism-inline-code-color);\">value</span>&nbsp;là&nbsp;<span style=\"background-color: var(--prism-inline-code-bg, #c9fffc); color: var(--prism-inline-code-color);\">value</span>&nbsp;của cái gì. Chỉ sử dụng tên dạng này khi đang trong ngữ cảnh cụ thể giúp bổ nghĩa cho những từ chung chung đó.</li></ol><h4>Đặt tên biến chung chung (trường hợp nên tránh)</h4><p><br></p><p>Ví dụ:</p><pre class=\"ql-syntax\" spellcheck=\"false\">var data = \'...\'; // không biết data là data của cái gì\nvar value = \'...\'; // không biết value là value của cái gì\n\n// var documentData = \'...\' ; Nên đặt rõ ràng ra như này\n// var documentValue = \'...\'; và như này\n</pre><p><br></p><h4>Đặt tên biến chung chung (trường hợp nên dùng)</h4><p><br></p><p>Ví dụ:</p><pre class=\"ql-syntax\" spellcheck=\"false\">function Document() {\n     var data = \'...\';\n    // hoặc\n     var value = \'...\';\n     \n    // var documentValue = \'...\'; Đặt như này sẽ bị lặp lại chữ \"document\" không cần thiết\n}\n</pre><p><br></p><p>Bạn chưa cần quan tâm&nbsp;<span style=\"background-color: var(--prism-inline-code-bg, #c9fffc); color: var(--prism-inline-code-color);\">function</span>&nbsp;là gì vì ta sẽ học nó ở những bài sau. Trong trường hợp này biến&nbsp;<span style=\"background-color: var(--prism-inline-code-bg, #c9fffc); color: var(--prism-inline-code-color);\">data</span>&nbsp;hoặc&nbsp;<span style=\"background-color: var(--prism-inline-code-bg, #c9fffc); color: var(--prism-inline-code-color);\">value</span>&nbsp;nằm trong&nbsp;<span style=\"background-color: var(--prism-inline-code-bg, #c9fffc); color: var(--prism-inline-code-color);\">Document</span>. Vì vậy&nbsp;<span style=\"background-color: var(--prism-inline-code-bg, #c9fffc); color: var(--prism-inline-code-color);\">Document</span>&nbsp;đã giúp lập trình viên khi nhìn vào hiểu được&nbsp;<span style=\"background-color: var(--prism-inline-code-bg, #c9fffc); color: var(--prism-inline-code-color);\">data</span>,&nbsp;<span style=\"background-color: var(--prism-inline-code-bg, #c9fffc); color: var(--prism-inline-code-color);\">value</span>&nbsp;là thuộc về&nbsp;<span style=\"background-color: var(--prism-inline-code-bg, #c9fffc); color: var(--prism-inline-code-color);\">Document</span>. Trong trường hợp này thì tên biến giúp đơn giản hóa và vẫn truyền đạt được đầy đủ ý nghĩa.</p><h2>Có thể bạn chưa biết</h2><ul><li>Đặt tên biến là một trong những kỹ năng quan trọng và phức tạp nhất trong lập trình. Nhìn lướt qua các tên biến có thể biết code nào được viết bởi người mới và người đã có nhiều kinh nghiệm.</li><li>Trong thực tế nhiều khi chúng ta phải làm việc trên code đã có sẵn thay vì viết hoàn toàn mới. Có khi bạn sẽ làm việc trên code cũ của người khác và ngược lại. Vì vậy đặt tên biến rõ ràng, dễ hiểu, truyền đạt đúng mục đích sử dụng là quan trọng hơn cả.</li><li>Chỉ sau vài tháng bạn có thể quên đi đoạn mã do chính tay mình viết. Để chính bạn hiểu bạn đã từng code cái gì trong quá khứ thì việc đặt tên biến tuân thủ các nguyên tắc trên là vô cùng quan trọng.</li></ul><p><br></p><p>Khi phải lựa chọn giữa&nbsp;<span style=\"background-color: var(--prism-inline-code-bg, #c9fffc); color: var(--prism-inline-code-color);\">performance</span>&nbsp;(hiệu năng) và&nbsp;<span style=\"background-color: var(--prism-inline-code-bg, #c9fffc); color: var(--prism-inline-code-color);\">clean code</span>&nbsp;(code sạch) người ta thường lựa chọn clean code. Việc đánh đổi này là cần thiết để giúp code dễ hiểu, dễ bảo trì và nâng cấp về sau. Và đặt tên biến chính là một trong những yếu tố giúp code của bạn trở nên clear hơn.</p><p>Fact:&nbsp;Code cho máy hiểu thì dễ, code cho người hiểu mới khó!</p><p><br></p>','2024-12-29 08:21:42','2024-12-29 08:21:42',246),(59,'https://www.youtube.com/watch?v=x0fSBAgBrOQ','<p><span style=\"background-color: rgba(255, 255, 255, 0.1);\">Đây là video mở đầu trong chuối video khóa học ReactJS miễn phí của F8, video này mình sẽ giới thiệu tới các bạn ReactJS là gì | Tại sao nên học ReactJS | Khóa học ReactJS miễn phí</span></p>','2025-05-09 12:22:14','2025-05-09 12:22:14',273),(60,'https://www.youtube.com/watch?v=30sMCciFIAM','<p><span style=\"background-color: rgba(255, 255, 255, 0.1);\">Ở video này chúng ta sẽ cùng nhau tìm hiểu về SPA/MPA là gì? | Khái niệm SPA |  ReactJS </span></p><p><span style=\"background-color: rgba(255, 255, 255, 0.1);\">SPA hay Single-page application là gì? Ngược lại chúng ta có MPA hay Multi-page application là gì? Hãy cùng tìm hiểu SPA &amp; MPA qua bài học thuộc khóa ReactJS này nhé.</span></p>','2025-05-09 12:23:05','2025-05-09 12:23:05',273);
/*!40000 ALTER TABLE `tbllesson` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbllessongroup`
--

DROP TABLE IF EXISTS `tbllessongroup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbllessongroup` (
  `id` int NOT NULL AUTO_INCREMENT,
  `courseId` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `Level` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `courseId` (`courseId`),
  CONSTRAINT `tblLessonGroup_ibfk_1` FOREIGN KEY (`courseId`) REFERENCES `tblcourse` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbllessongroup`
--

LOCK TABLES `tbllessongroup` WRITE;
/*!40000 ALTER TABLE `tbllessongroup` DISABLE KEYS */;
INSERT INTO `tbllessongroup` VALUES (1,3,'Giới thiệu','2024-05-05 00:00:00','2024-05-05 00:00:00',1),(2,3,'Biến, comments, built-in','2024-05-05 00:00:00','2024-05-05 00:00:00',2),(13,3,'Toán tử, kiểu dữ liệu','2024-11-06 09:15:26','2024-11-06 09:15:26',3),(14,3,'Làm việc với hàm','2024-11-06 09:16:16','2024-11-06 09:16:16',4),(15,3,'Làm việc với chuỗi','2024-11-06 09:17:51','2024-11-06 09:17:51',5),(16,3,'Làm việc với số','2024-11-06 09:18:30','2024-11-06 09:18:30',6),(17,3,'Làm việc với object','2024-11-06 09:19:42','2024-11-06 09:19:42',7),(18,3,'Lệnh rẽ nhánh, toán tử 3 ngôi','2024-11-06 09:20:14','2024-11-06 09:20:14',8),(19,3,'Vòng lặp','2024-11-06 09:20:50','2024-11-06 09:20:50',9),(21,3,'Callback JS','2024-11-06 09:22:18','2024-11-06 09:22:18',11),(22,3,'HTML DOM','2024-11-06 09:22:52','2024-11-06 09:22:52',12),(23,3,'JSON, Fetch, Postman','2024-11-06 09:23:14','2024-11-06 09:23:14',13),(24,3,'ECMAScript 6+','2024-11-06 09:23:57','2024-11-06 09:23:57',14),(25,3,'Các bài thực hành','2024-11-06 09:24:27','2024-11-06 09:24:27',15),(26,3,'Form validation I','2024-11-06 09:25:21','2024-11-06 09:25:21',16),(27,3,'Form validation II','2024-11-06 09:25:47','2024-11-06 09:25:47',17),(28,3,'Tham khảo thêm','2024-11-06 09:26:08','2024-11-06 09:26:08',18),(29,3,'Hoàn thành khóa học','2024-11-06 09:26:28','2024-11-06 09:26:28',19),(30,3,'Làm việc với mảng II','2024-12-31 21:20:02','2024-12-31 21:20:02',20),(31,42,'Giới thiệu','2025-05-09 12:12:55','2025-05-09 12:12:55',1),(32,42,'Ôn lại ES6+','2025-05-09 12:13:11','2025-05-09 12:13:11',2),(33,42,'React, ReactDOM','2025-05-09 12:13:23','2025-05-09 12:13:23',3),(34,42,'JSX, Components, Props','2025-05-09 12:13:49','2025-05-09 12:13:49',4),(35,42,'Create React App','2025-05-09 12:14:05','2025-05-09 12:14:05',5),(36,42,'Hooks ','2025-05-09 12:14:25','2025-05-09 12:14:25',6),(37,42,'CSS, SCSS và CSS modules','2025-05-09 12:14:41','2025-05-09 12:14:41',7),(38,42,'React Router V6','2025-05-09 12:14:59','2025-05-09 12:14:59',8),(39,42,'Dựng base dự án Tiktok','2025-05-09 12:15:13','2025-05-09 12:15:13',9),(40,42,'Xây dựng phần Header','2025-05-09 12:15:29','2025-05-09 12:15:29',10),(41,42,'Xây dựng UI phần Header #6','2025-05-09 12:15:52','2025-05-09 12:15:52',11),(42,42,'Xây dựng phần Sidebar','2025-05-09 12:16:14','2025-05-09 12:16:14',12),(43,42,'Xây dựng phần Authen','2025-05-09 12:16:29','2025-05-09 12:16:29',13),(44,42,'Xây dựng phần xem video','2025-05-09 12:16:42','2025-05-09 12:16:42',14),(45,42,'Dựng phần theo dõi & thả tim','2025-05-09 12:17:01','2025-05-09 12:17:01',15);
/*!40000 ALTER TABLE `tbllessongroup` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbllikeblog`
--

DROP TABLE IF EXISTS `tbllikeblog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbllikeblog` (
  `userId` int NOT NULL,
  `blogId` int NOT NULL,
  `heartDay` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`userId`,`blogId`),
  KEY `tblLikeBlog_tblBlogger_FK` (`blogId`),
  CONSTRAINT `tblLikeBlog_tblBlogger_FK` FOREIGN KEY (`blogId`) REFERENCES `tblblogger` (`id`),
  CONSTRAINT `tblLikeBlog_tblUser_FK` FOREIGN KEY (`userId`) REFERENCES `tbluser` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbllikeblog`
--

LOCK TABLES `tbllikeblog` WRITE;
/*!40000 ALTER TABLE `tbllikeblog` DISABLE KEYS */;
INSERT INTO `tbllikeblog` VALUES (32,7,'2025-06-05 08:33:41'),(32,8,'2025-06-05 08:08:36'),(32,9,'2025-06-05 08:18:56'),(36,8,'2025-06-05 07:40:02'),(36,9,'2025-06-07 15:55:13');
/*!40000 ALTER TABLE `tbllikeblog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbllikecomment`
--

DROP TABLE IF EXISTS `tbllikecomment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbllikecomment` (
  `userId` int NOT NULL,
  `commentId` int NOT NULL,
  `createAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updateAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `icon` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`userId`,`commentId`),
  KEY `tblLikeComment_tblCommentLesson_FK` (`commentId`),
  CONSTRAINT `tblLikeComment_tblCommentLesson_FK` FOREIGN KEY (`commentId`) REFERENCES `tblcommentlesson` (`id`),
  CONSTRAINT `tblLikeComment_tblUser_FK` FOREIGN KEY (`userId`) REFERENCES `tbluser` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbllikecomment`
--

LOCK TABLES `tbllikecomment` WRITE;
/*!40000 ALTER TABLE `tbllikecomment` DISABLE KEYS */;
INSERT INTO `tbllikecomment` VALUES (32,186,'2025-05-13 15:02:09','2025-05-13 15:02:08','happy'),(36,158,'2025-05-13 15:01:28','2025-05-13 15:01:28','satisfaction'),(36,164,'2025-06-07 23:00:30','2025-06-07 23:00:30','satisfaction'),(36,168,'2025-06-02 01:28:12','2025-06-02 01:28:12','happy'),(36,169,'2025-06-02 01:33:54','2025-06-02 01:33:54','satisfaction'),(36,170,'2025-05-27 09:21:15','2025-05-27 09:21:15','satisfaction'),(36,187,'2025-05-30 11:32:31','2025-05-30 11:32:31','satisfaction'),(36,189,'2025-05-30 11:42:54','2025-05-30 11:42:53','satisfaction'),(36,191,'2025-06-02 01:10:50','2025-06-02 01:10:49','happy');
/*!40000 ALTER TABLE `tbllikecomment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblnote`
--

DROP TABLE IF EXISTS `tblnote`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tblnote` (
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `description` text,
  `id` int NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `tblNote_tblLectureDetails_FK` FOREIGN KEY (`id`) REFERENCES `tbllecturedetails` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblnote`
--

LOCK TABLES `tblnote` WRITE;
/*!40000 ALTER TABLE `tblnote` DISABLE KEYS */;
INSERT INTO `tblnote` VALUES ('2024-11-13 07:20:58','2024-11-13 07:20:58','<p>Học lập trình một mình sao bằng có bạn bè cùng tiến? Đừng để bản thân phải lạc lõng, hãy ghé qua Discord của F8 và cảm nhận sự khác biệt nhé!</p><ul><li>Bạn sẽ được học cùng những người bạn mới, giỏi giang, đẹp trai, xinh gái!</li><li>Cùng xây dựng team code siêu chất, học hỏi lẫn nhau và tiến bộ cùng nhau!</li><li>Học hỏi từ người đi trước, có thêm động lực và sự tự giác trong học tập!</li><li>Nơi mà sự tiêu cực không có chỗ đứng, câu hỏi nào cũng được trả lời, không sợ bị đánh giá toxic, chỉ có sự hỗ trợ và tôn trọng lẫn nhau!</li></ul><p>✅&nbsp;<strong>THAM GIA NGAY</strong>:&nbsp;<a href=\"https://discord.gg/sCdvr5MufX\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: var(--primary-color);\">https://discord.gg/sCdvr5MufX</a></p><p><a href=\"https://discord.gg/sCdvr5MufX\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: var(--primary-color);\"><img src=\"https://files.fullstack.edu.vn/f8-prod/public-images/6603da227f20c.png\"></a></p><p><em>Hãy biến quá trình học lập trình của bạn thành một hành trình thú vị và đầy ắp tiếng cười!</em></p>',48),('2024-12-13 13:22:41','2024-12-13 13:22:41','<h1>Làm quen với màn thử thách</h1><p>Cập nhật&nbsp;tháng 6 năm 2024</p><p><br></p><blockquote>Nội dung quan trọng! Vui lòng đọc kỹ!</blockquote><p>Chào các bạn, tại F8 các bạn không chỉ được học qua video, F8 có ít nhất 3 loại bài học dành cho các bạn:</p><ol><li>Bài học dạng video</li><li>Bài học dạng text - văn bản</li><li>Bài học dạng thử thách - bài tập</li></ol><p>Trong bài sau, các bạn sẽ được làm quen với màn&nbsp;<strong>Thử thách</strong>.</p><h2>Màn thử thách chia làm 4 phần</h2><ol><li><strong>NỘI DUNG:</strong>&nbsp;Chứa mô tả - yêu cầu của thử thách, cho bạn biết cách để vượt qua thử thách</li><li><strong>TRÌNH DUYỆT:</strong>&nbsp;Hiển thị trang web của bạn, khi viết code tại&nbsp;<span style=\"background-color: var(--prism-inline-code-bg, #c9fffc); color: var(--prism-inline-code-color);\">index.html</span>&nbsp;giao diện sẽ tự động được làm mới</li><li><strong>CODE EDITOR:</strong>&nbsp;Nơi chứa các file như&nbsp;<span style=\"background-color: var(--prism-inline-code-bg, #c9fffc); color: var(--prism-inline-code-color);\">index.html</span>,&nbsp;<span style=\"background-color: var(--prism-inline-code-bg, #c9fffc); color: var(--prism-inline-code-color);\">index.js</span>, các bạn sẽ viết code tại đây để hoàn thành thử thách</li><li><strong>BÀI KIỂM TRA:</strong>&nbsp;Danh sách các bài kiểm tra để xác minh phần trả lời của bạn là đúng yêu cầu đề bài. Các bài kiểm tra sẽ báo lỗi khi bạn làm sai, hãy dựa vào các thông báo lỗi để tìm cách vượt qua thử thách nhé</li></ol><h2>Demo cách sử dụng màn thử thách</h2><h2>Tổng kết</h2><ol><li><strong>Luôn luôn đọc kỹ yêu cầu trong phần NỘI DUNG</strong></li><li><strong>Khi viết code trong EDITOR, luôn luôn mở TRÌNH DUYỆT để xem giao diện trực quan (nếu có tệp index.html)</strong></li><li><strong>Nhấn KIỂM TRA để chấm phần trả lời, đọc kỹ thông báo lỗi để tìm cách giải quyết</strong></li></ol><p>Chúc các bạn học tập tốt 🥰</p><p><br></p>',52),('2024-12-13 13:23:26','2024-12-13 13:23:26','<p>Tham gia các cộng đồng để cùng học hỏi, chia sẻ và \"thám thính\" xem F8 sắp có gì mới nhé!</p><ul><li>Fanpage:&nbsp;<a href=\"https://www.facebook.com/f8vnofficial\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: var(--primary-color);\">https://www.facebook.com/f8vnofficial</a></li><li>Group:&nbsp;<a href=\"https://www.facebook.com/groups/649972919142215\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: var(--primary-color);\">https://www.facebook.com/groups/649972919142215</a></li><li>Youtube:&nbsp;<a href=\"https://www.youtube.com/F8VNOfficial\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: var(--primary-color);\">https://www.youtube.com/F8VNOfficial</a></li></ul><h2>Học Offline tại F8?</h2><p>F8 có các lớp học Offline tại Hà Nội các bạn nhé. Lớp học linh hoạt, phù hợp cho cả sinh viên và người đi làm.</p><p>Hình ảnh không gian học tập tại F8:</p><p><img src=\"https://files.fullstack.edu.vn/f8-prod/public-images/646de7c4d0d94.jpg\"></p><p><img src=\"https://files.fullstack.edu.vn/f8-prod/public-images/646de7ce47ddb.jpg\"></p><p>✅ Để lại thông tin để F8 tư vấn miễn phí cho bạn:&nbsp;<a href=\"https://short.f8team.dev/dang-ky-hoc-offline-hn\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: var(--primary-color);\">https://short.f8team.dev/dang-ky-hoc-offline-hn</a></p><h2>Cách hoàn thành bài học video?</h2><ul><li>Xem hết nội dung video là sẽ hoàn thành bài học</li><li>Tắt extension chặn quảng cáo (VD adsblock) vì có thể gây xung đột</li><li>Xem video ở tốc độ vừa phải, tua quá nhanh hoặc để tốc độ quá nhanh có thể không hoàn thành được bài học</li></ul><h2>Cách hoàn thành bài học text?</h2><ul><li>Bạn cần đọc hết nội dung, cuộn xuống dưới cùng để hoàn thành bài</li><li>Nếu cuộn xuống quá nhanh, có thể bạn sẽ không hoàn thành được bài học</li></ul><blockquote>Bài này chính là một bài học dạng text, bạn cần đọc hết nội dung để có thể hoàn thành bài học này.</blockquote><h2>Tại sao bài học lại bị khóa?</h2><ul><li>Giúp người mới học tập đúng lộ trình một cách bài bản</li><li>Cấp chứng chỉ hoàn thành khóa học cho bạn 🎉🎉</li></ul><h2>Bài kiểm tra là gì?</h2><p>Tại F8, bạn có thể thực hành sau mỗi bài học ngay tại trang web này, mỗi bài thực hành có thể có những bài kiểm tra. Các bài kiểm tra được đưa ra nhằm đảm bảo code của bạn đã đạt yêu cầu.</p><blockquote>Một số bài thực hành có thể không có bài kiểm tra, những bài này thường mang tính ví dụ, bạn có thể nhấn&nbsp;<span style=\"background-color: var(--prism-inline-code-bg, #c9fffc); color: var(--prism-inline-code-color);\">Kiểm tra</span>&nbsp;để hoàn thành các bài ví dụ.</blockquote><h2>Giúp admin report các bình luận spam nhé!</h2><p>Xin nhắc lại, phần Hỏi đáp tại mỗi bài học là để hỏi đáp/trao đổi về kiến thức đã học. Các bình luận spam không mang lại giá trị cho người đọc, vì vậy chúng ta nên tránh nhé.</p><p><strong>Những nội dung sau được coi là spam:</strong></p><ol><li>\"Đã xong\", \"Đã hoàn thành\", v.v</li><li>\"Tôi đã ở đây\"</li><li>\"Day 1\", \"Day 2\", \"Day xx\", v.v</li><li>Các bình luận không phù hợp văn hóa, thuần phong mỹ tục</li></ol><blockquote>Nếu thấy các bình luận spam, các bạn giúp admin nhấn vào nút \"Báo cáo bình luận\" bên cạnh mỗi bình luận nhé. Admin đang xây dựng chức năng block tài khoản, một số tài khoản vi phạm có thể bị block vô thời hạn trong tương lai.</blockquote><p>Cảm ơn các bạn! Chúc các bạn học vui &lt;3</p><p><br></p>',53);
/*!40000 ALTER TABLE `tblnote` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblNotifications`
--

DROP TABLE IF EXISTS `tblNotifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tblNotifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `title` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `message` text,
  `is_read` tinyint(1) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `entity_type` varchar(100) DEFAULT NULL,
  `entity_id` varchar(100) DEFAULT NULL,
  `data_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `tblNotifications_tbluser_FK` (`user_id`),
  CONSTRAINT `tblNotifications_tbluser_FK` FOREIGN KEY (`user_id`) REFERENCES `tbluser` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblNotifications`
--

LOCK TABLES `tblNotifications` WRITE;
/*!40000 ALTER TABLE `tblNotifications` DISABLE KEYS */;
INSERT INTO `tblNotifications` VALUES (14,36,'Bài viết của bạn đã được duyệt','Bài viết \"Tổng hợp các hình nền đẹp\" đã được phê duyệt và hiển thị công khai.',0,'2025-06-05 01:36:32','Post','7',NULL),(15,36,'Bài viết của bạn đã được duyệt','Bài viết \"Hello Xin chào\" đã được phê duyệt và hiển thị công khai.',0,'2025-06-05 01:36:33','Post','5',NULL),(16,36,'Bài viết của bạn đã được duyệt','Bài viết \"Tình yêu là gì ?\" đã được phê duyệt và hiển thị công khai.',0,'2025-06-05 01:36:34','Post','6',NULL),(17,36,'Bài viết của bạn đã được lưu','Nguyễn Xuân Huỳnh đã lưu bài viết \"Tổng hợp các hình nền đẹp\" của bạn.',0,'2025-06-05 08:04:44','Post','7',NULL),(18,36,'Bài viết của bạn đã được lưu','Nguyễn Xuân Huỳnh đã lưu bài viết \"Chuyện Code Chuyện Đời – Lại chuyện tình iu và chuyện kinh nghiệm code\" của bạn.',0,'2025-06-05 08:18:53','Post','9',NULL),(20,36,'Bài viết của bạn đã được lưu','Nguyễn Xuân Huỳnh đã lưu bài viết \"Chuyện Code Chuyện Đời – Lại chuyện tình iu và chuyện kinh nghiệm code\" của bạn.',0,'2025-06-05 08:18:57','Post','9',NULL),(21,36,'Bài viết của bạn đã được lưu','Nguyễn Xuân Huỳnh đã lưu bài viết \"Tổng hợp các hình nền đẹp\" của bạn.',0,'2025-06-05 08:33:27','Post','7',NULL);
/*!40000 ALTER TABLE `tblNotifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblOrderDetails`
--

DROP TABLE IF EXISTS `tblOrderDetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tblOrderDetails` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `course_id` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_OrderDetails_Orders` (`order_id`),
  KEY `FK_OrderDetails_Course` (`course_id`),
  CONSTRAINT `FK_OrderDetails_Course` FOREIGN KEY (`course_id`) REFERENCES `tblcourse` (`id`),
  CONSTRAINT `FK_OrderDetails_Orders` FOREIGN KEY (`order_id`) REFERENCES `tblOrders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblOrderDetails`
--

LOCK TABLES `tblOrderDetails` WRITE;
/*!40000 ALTER TABLE `tblOrderDetails` DISABLE KEYS */;
INSERT INTO `tblOrderDetails` VALUES (14,14,42,1499000.00),(15,15,42,1499000.00),(16,16,42,1499000.00),(17,17,42,1499000.00),(18,18,42,1499000.00),(19,19,42,1499000.00),(20,20,42,1499000.00),(21,21,42,1499000.00),(22,22,42,1499000.00),(23,23,42,1499000.00),(24,24,42,1499000.00),(25,25,42,1499000.00),(26,26,42,1499000.00),(27,27,42,1499000.00),(28,28,42,1499000.00),(29,29,42,1499000.00),(30,30,42,1499000.00),(31,31,42,1499000.00),(32,32,42,1499000.00),(33,33,42,1499000.00),(34,34,42,1499000.00),(35,35,42,1499000.00),(36,36,42,1499000.00),(37,37,42,1499000.00),(38,38,42,1499000.00);
/*!40000 ALTER TABLE `tblOrderDetails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblOrders`
--

DROP TABLE IF EXISTS `tblOrders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tblOrders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `amount` decimal(10,0) DEFAULT NULL,
  `transactionId` bigint DEFAULT NULL,
  `status` varchar(100) DEFAULT NULL,
  `paymentGateway` varchar(100) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `tblOrders_tbluser_FK` (`user_id`),
  CONSTRAINT `tblOrders_tbluser_FK` FOREIGN KEY (`user_id`) REFERENCES `tbluser` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblOrders`
--

LOCK TABLES `tblOrders` WRITE;
/*!40000 ALTER TABLE `tblOrders` DISABLE KEYS */;
INSERT INTO `tblOrders` VALUES (14,32,1499000,1747044440235,'pending','vnpay','2025-05-12 10:07:20','2025-05-12 17:07:20'),(15,32,1499000,1747044699132,'pending','vnpay','2025-05-12 10:11:39','2025-05-12 17:11:39'),(16,32,1499000,1747045564019,'pending','vnpay','2025-05-12 10:26:04','2025-05-12 17:26:04'),(17,32,1499000,1747045588560,'pending','vnpay','2025-05-12 10:26:29','2025-05-12 17:26:28'),(18,32,1499000,1747052100690,'pending','vnpay','2025-05-12 12:15:01','2025-05-12 19:15:00'),(19,32,1499000,1747052417755,'pending','vnpay','2025-05-12 12:20:18','2025-05-12 19:20:17'),(20,32,1499000,1747052647905,'pending','vnpay','2025-05-12 12:24:08','2025-05-12 19:24:07'),(21,32,1499000,1747052702814,'pending','vnpay','2025-05-12 12:25:03','2025-05-12 19:25:02'),(22,32,1499000,1747052737895,'pending','vnpay','2025-05-12 12:25:38','2025-05-12 19:25:37'),(23,32,1499000,1747055963720,'pending','vnpay','2025-05-12 13:19:24','2025-05-12 20:19:23'),(24,32,1499000,1747056472951,'success','vnpay','2025-05-12 13:27:53','2025-05-12 13:28:25'),(25,36,1499000,1747105847587,'success','vnpay','2025-05-13 03:10:48','2025-05-13 03:11:47'),(26,36,1499000,1747108972288,'success','vnpay','2025-05-13 04:02:52','2025-05-13 04:03:27'),(27,36,1499000,1747123406530,'success','vnpay','2025-05-13 08:03:27','2025-05-13 08:04:20'),(28,36,1499000,1747562532197,'pending','vnpay','2025-05-18 10:02:12','2025-05-18 17:02:12'),(29,36,1499000,1748579199677,'pending','vnpay','2025-05-30 04:26:40','2025-05-30 11:26:39'),(30,32,1499000,1749029760862,'pending','vnpay','2025-06-04 09:36:01','2025-06-04 16:36:00'),(31,32,1499000,1749038801736,'pending','vnpay','2025-06-04 12:06:42','2025-06-04 19:06:41'),(32,32,1499000,1749038812004,'pending','vnpay','2025-06-04 12:06:52','2025-06-04 19:06:52'),(33,32,1499000,1749056538418,'pending','vnpay','2025-06-04 17:02:18','2025-06-05 00:02:18'),(34,36,1499000,1749091084755,'pending','vnpay','2025-06-05 02:38:05','2025-06-05 09:38:04'),(35,36,1499000,1749091386229,'pending','vnpay','2025-06-05 02:43:06','2025-06-05 09:43:06'),(36,36,1499000,1749108179796,'pending','vnpay','2025-06-05 07:23:00','2025-06-05 14:22:59'),(37,32,1499000,1749125423424,'pending','vnpay','2025-06-05 12:10:23','2025-06-05 19:10:23'),(38,36,1499000,1749312199622,'pending','vnpay','2025-06-07 16:03:20','2025-06-07 23:03:19');
/*!40000 ALTER TABLE `tblOrders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblPaymentResults`
--

DROP TABLE IF EXISTS `tblPaymentResults`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tblPaymentResults` (
  `id` int NOT NULL AUTO_INCREMENT,
  `transactionId` bigint NOT NULL,
  `queryString` text,
  `isSuccess` tinyint(1) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblPaymentResults`
--

LOCK TABLES `tblPaymentResults` WRITE;
/*!40000 ALTER TABLE `tblPaymentResults` DISABLE KEYS */;
INSERT INTO `tblPaymentResults` VALUES (4,1747056472951,'Microsoft.AspNetCore.Http.QueryCollectionInternal',1,'2025-05-12 13:28:25'),(5,1747105847587,'Microsoft.AspNetCore.Http.QueryCollectionInternal',1,'2025-05-13 03:11:47'),(6,1747108972288,'Microsoft.AspNetCore.Http.QueryCollectionInternal',1,'2025-05-13 04:03:27'),(7,1747123406530,'Microsoft.AspNetCore.Http.QueryCollectionInternal',1,'2025-05-13 08:04:20');
/*!40000 ALTER TABLE `tblPaymentResults` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblPostSaved`
--

DROP TABLE IF EXISTS `tblPostSaved`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tblPostSaved` (
  `user_id` int NOT NULL,
  `post_id` int NOT NULL,
  `create_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`post_id`,`user_id`),
  KEY `tblPostSaved_tbluser_FK` (`user_id`),
  CONSTRAINT `tblPostSaved_tblblogger_FK` FOREIGN KEY (`post_id`) REFERENCES `tblblogger` (`id`),
  CONSTRAINT `tblPostSaved_tbluser_FK` FOREIGN KEY (`user_id`) REFERENCES `tbluser` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblPostSaved`
--

LOCK TABLES `tblPostSaved` WRITE;
/*!40000 ALTER TABLE `tblPostSaved` DISABLE KEYS */;
INSERT INTO `tblPostSaved` VALUES (32,7,'2025-06-05 08:33:27'),(36,8,'2025-06-07 10:16:43'),(36,9,'2025-06-07 15:55:23');
/*!40000 ALTER TABLE `tblPostSaved` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblquestioncode`
--

DROP TABLE IF EXISTS `tblquestioncode`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tblquestioncode` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT (now()),
  `updated_at` datetime DEFAULT (now()),
  `description` text,
  `languageId` int DEFAULT NULL,
  `starterCode` text,
  `solution` text,
  `resultcode` text,
  PRIMARY KEY (`id`),
  KEY `tblQuestionCode_tblLanguageCode_FK` (`languageId`),
  CONSTRAINT `tblQuestionCode_ibfk_1` FOREIGN KEY (`id`) REFERENCES `tbllecturedetails` (`id`),
  CONSTRAINT `tblQuestionCode_tblLanguageCode_FK` FOREIGN KEY (`languageId`) REFERENCES `tbllanguagecode` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblquestioncode`
--

LOCK TABLES `tblquestioncode` WRITE;
/*!40000 ALTER TABLE `tblquestioncode` DISABLE KEYS */;
INSERT INTO `tblquestioncode` VALUES (54,'2024-12-22 15:24:43','2024-12-22 15:24:43','<h2>Xin chào các bạn!</h2><p>Đây là màn hình Thử Thách tại F8 các bạn nhé. Từ các bài học sau, các bạn sẽ có những bài tập cần phải vượt qua sau khi học mỗi kiến thức mới.</p><p>Hãy bắt đầu làm quen với màn Thử Thách này bằng cách làm theo yêu cầu dưới đây:</p><p>👉 Hãy nhấn copy và dán đoạn code sau vào file&nbsp;<span style=\"background-color: var(--prism-inline-code-bg, #c9fffc); color: var(--prism-inline-code-color);\">main.js</span>:</p><pre class=\"ql-syntax\" spellcheck=\"false\">console.log(\'Hello world\');',1,'console.log();','Thêm console.log(\'Hello world\'); vào tệp index.js','console.log(\'Hello world\');'),(57,'2025-01-01 11:40:59','2025-01-01 11:40:59','<p>Vượt qua thử thách này bằng cách tạo một hàm tên là&nbsp;<span style=\"background-color: var(--prism-inline-code-bg, #c9fffc); color: var(--prism-inline-code-color);\">sum</span>.</p><blockquote>Chỉ cần tạo hàm, không cần viết gì trong phần thân của hàm.</blockquote><p><br></p>',1,'// code ở đây','<p>Tạo hàm tên là sum</p>','function sum () {}'),(58,'2025-01-01 14:04:00','2025-01-01 14:04:00','<p><span style=\"color: rgb(41, 41, 41);\">Bạn hãy sử dụng&nbsp;</span><span style=\"color: rgb(41, 41, 41); background-color: var(--prism-inline-code-bg, #c9fffc);\">spread</span><span style=\"color: rgb(41, 41, 41);\">&nbsp;để sao chép tất cả các&nbsp;</span><span style=\"color: rgb(41, 41, 41); background-color: var(--prism-inline-code-bg, #c9fffc);\">key</span><span style=\"color: rgb(41, 41, 41);\">&nbsp;và&nbsp;</span><span style=\"color: rgb(41, 41, 41); background-color: var(--prism-inline-code-bg, #c9fffc);\">value</span><span style=\"color: rgb(41, 41, 41);\">&nbsp;từ object&nbsp;</span><span style=\"color: rgb(41, 41, 41); background-color: var(--prism-inline-code-bg, #c9fffc);\">person1</span><span style=\"color: rgb(41, 41, 41);\">&nbsp;sang&nbsp;</span><span style=\"color: rgb(41, 41, 41); background-color: var(--prism-inline-code-bg, #c9fffc);\">person2</span></p>',1,'const person1 = {\r\n    name: \'Son\',\r\n    age: 21\r\n}\r\n\r\nconst person2 = \r\n\r\n// Expected results\r\nconsole.log(person2.name) // Output: \'Son\'\r\nconsole.log(person2.age) // Output: 21\r\nconsole.log(person1 === person2) // Output: false','<p>Tạo biến person2</p>','const person1 = {\r\n    name: \'Son\',\r\n    age: 21\r\n}\r\n\r\nconst person2 = {...person1}\r\n// Expected results\r\n// console.log(person2.name) // Output: \'Son\'\r\n// console.log(person2.age) // Output: 21\r\n// console.log(person1 === person2) // Output: false');
/*!40000 ALTER TABLE `tblquestioncode` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblquestionslesson`
--

DROP TABLE IF EXISTS `tblquestionslesson`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tblquestionslesson` (
  `id` int NOT NULL AUTO_INCREMENT,
  `question` text NOT NULL,
  `created_at` datetime DEFAULT (now()),
  `updated_at` datetime DEFAULT (now()),
  PRIMARY KEY (`id`),
  CONSTRAINT `tblQuestionsLesson_ibfk_1` FOREIGN KEY (`id`) REFERENCES `tbllecturedetails` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblquestionslesson`
--

LOCK TABLES `tblquestionslesson` WRITE;
/*!40000 ALTER TABLE `tblquestionslesson` DISABLE KEYS */;
INSERT INTO `tblquestionslesson` VALUES (49,'<pre class=\"ql-syntax\" spellcheck=\"false\">var a = 1;\nvar b = -1;\nvar c = 0;\nvar d = 0;\n\nvar e = a &lt;= b;\nvar f = c === d;\nvar g = a &gt;= c;\n\nconsole.log(e, f, g) // Output: ?\n</pre>','2024-11-15 10:46:37','2024-11-15 10:46:37'),(50,'<pre class=\"ql-syntax\" spellcheck=\"false\">function showMessage(message) {\n&nbsp;&nbsp;console.log(message);\n}\n\nshowMessage(\"Hi anh em F8!\");\n</pre><p><br></p>','2024-11-15 13:04:33','2024-11-15 13:04:33'),(61,'<p><span style=\"color: rgb(41, 41, 41);\">Ưu điểm của SPA là gì? Chọn câu trả lời đúng.</span></p>','2025-05-09 12:24:45','2025-05-09 12:24:45');
/*!40000 ALTER TABLE `tblquestionslesson` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblquestionslessondetails`
--

DROP TABLE IF EXISTS `tblquestionslessondetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tblquestionslessondetails` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `quesonId` int DEFAULT NULL,
  `answer` text,
  `isTrue` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`Id`),
  KEY `tblQuestionsLessonDetails_tblQuestionsLesson_FK` (`quesonId`),
  CONSTRAINT `tblQuestionsLessonDetails_tblQuestionsLesson_FK` FOREIGN KEY (`quesonId`) REFERENCES `tblquestionslesson` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblquestionslessondetails`
--

LOCK TABLES `tblquestionslessondetails` WRITE;
/*!40000 ALTER TABLE `tblquestionslessondetails` DISABLE KEYS */;
INSERT INTO `tblquestionslessondetails` VALUES (14,49,'true false true',0),(15,49,'false false true',0),(16,49,'false true true',1),(17,50,'message là đối số (argument)',0),(18,50,'message là tham số (parameter)',1),(19,50,'\"Hi anh em F8!\" là tham số (parameter)',0),(20,61,'Không yêu cầu tải lại trang khi chuyển trang.',1),(21,61,'Có thể làm được nhiều hiệu ứng chuyển động trên web',0),(22,61,'Thời gian phát triển ứng dụng nhanh hơn',0);
/*!40000 ALTER TABLE `tblquestionslessondetails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblrole`
--

DROP TABLE IF EXISTS `tblrole`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tblrole` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `Authorrities` int DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblrole`
--

LOCK TABLES `tblrole` WRITE;
/*!40000 ALTER TABLE `tblrole` DISABLE KEYS */;
INSERT INTO `tblrole` VALUES (1,'User',0,NULL,NULL),(2,'Admin',1,NULL,NULL);
/*!40000 ALTER TABLE `tblrole` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblroute`
--

DROP TABLE IF EXISTS `tblroute`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tblroute` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` text,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblroute`
--

LOCK TABLES `tblroute` WRITE;
/*!40000 ALTER TABLE `tblroute` DISABLE KEYS */;
/*!40000 ALTER TABLE `tblroute` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblSteps`
--

DROP TABLE IF EXISTS `tblSteps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tblSteps` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Title` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `Description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblSteps`
--

LOCK TABLES `tblSteps` WRITE;
/*!40000 ALTER TABLE `tblSteps` DISABLE KEYS */;
INSERT INTO `tblSteps` VALUES (1,'HTML và CSS','Để học web Front-end chúng ta luôn bắt đầu với ngôn ngữ HTML và CSS, đây là 2 ngôn ngữ có mặt trong mọi website trên internet. Trong khóa học này F8 sẽ chia sẻ từ những kiến thức cơ bản nhất. Sau khóa học này bạn sẽ tự làm được 2 giao diện websites là The Band và Shopee.','2025-04-22 10:01:07','2025-04-22 10:07:15'),(2,'CSS cơ bản','Làm đẹp giao diện với CSS, flexbox, grid.','2025-04-22 10:01:07','2025-04-22 10:01:07'),(3,'JavaScript','Với HTML, CSS bạn mới chỉ xây dựng được các websites tĩnh, chỉ bao gồm phần giao diện và gần như chưa có xử lý tương tác gì. Để thêm nhiều chức năng phong phú và tăng tính tương tác cho website bạn cần học Javascript.\n\nLập Trình JavaScript Cơ Bản\n','2025-04-22 10:01:07','2025-04-22 10:07:27'),(4,'Sử dụng Ubuntu/Linux','Cách làm việc với hệ điều hành Ubuntu/Linux qua Windows Terminal & WSL. Khi đi làm, nhiều trường hợp bạn cần nắm vững các dòng lệnh cơ bản của Ubuntu/Linux.','2025-04-22 10:01:07','2025-04-22 10:07:39'),(5,'Libraries and Frameworks','ột websites hay ứng dụng hiện đại rất phức tạp, chỉ sử dụng HTML, CSS, Javascript theo cách code thuần (tự code từ đầu tới cuối) sẽ rất khó khăn. Vì vậy các Libraries, Frameworks ra đời nhằm đơn giản hóa, tiết kiệm chi phí và thời gian để hoàn thành một sản phẩm website hoặc ứng dụng mobile.','2025-04-22 10:01:07','2025-04-22 10:07:59'),(6,'.NET Core Web API','Tạo RESTful API backend.','2025-04-22 10:01:07','2025-04-22 10:01:07'),(7,'Entity Framework','Quản lý database hiệu quả bằng EF.','2025-04-22 10:01:07','2025-04-22 10:01:07'),(8,'JWT & bảo mật API','Xác thực, phân quyền người dùng.','2025-04-22 10:01:07','2025-04-22 10:01:07'),(9,'Python cơ bản','Lập trình nền tảng cho AI.','2025-04-22 10:01:07','2025-04-22 10:01:07'),(10,'Machine Learning cơ bản','Tư duy mô hình học máy.','2025-04-22 10:01:07','2025-04-22 10:01:07'),(11,'Xử lý dữ liệu','Dùng Pandas, NumPy để xử lý data.','2025-04-22 10:01:07','2025-04-22 10:01:07'),(12,'Deep Learning','Xây dựng mạng neural bằng TensorFlow.','2025-04-22 10:01:07','2025-04-22 10:01:07'),(13,'Nhập môn CNTT','Nắm được 1 số khái niệm về CNTT, biết cách sử dụng IDE','2025-04-22 10:05:29','2025-04-22 10:05:29');
/*!40000 ALTER TABLE `tblSteps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbluser`
--

DROP TABLE IF EXISTS `tbluser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbluser` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `FullName` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `Email` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `Password` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `Avatar` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `IsActive` int DEFAULT NULL,
  `CodeId` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `codeExpired` datetime(6) DEFAULT NULL,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `RoleId` int NOT NULL DEFAULT '0',
  `Bio` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `FacebookLink` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `GithubLink` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `PersonalWebsite` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `UserName` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `YoutubeLink` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `GithubId` int DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_tblUser_RoleId` (`RoleId`),
  CONSTRAINT `tblUser_ibfk_1` FOREIGN KEY (`RoleId`) REFERENCES `tblrole` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=98 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbluser`
--

LOCK TABLES `tbluser` WRITE;
/*!40000 ALTER TABLE `tbluser` DISABLE KEYS */;
INSERT INTO `tbluser` VALUES (32,'Nguyễn Xuân Huỳnh','nguyenhuynhdt37@gmail.com','$2a$11$TLIWWU58ofqY3IBCmvNOSeMT.9BSf0uPcr1GanH8aLeYQ6aMUnkri','/images/users/avatars/anh-trai-dep-deo-kinh-600x600.jpg',1,'571980','2024-11-04 14:40:25.640807','2024-10-14 17:51:24','2025-06-01 10:16:28',1,'s','https://www.facebook.com/nguyenxuanhuynh2004/','https://github.com/nguyenhuynhdt37/',NULL,'huynhnguyenxuan','https://www.youtube.com/@nguyenxuanhuynh2211',127924881),(36,'Huỳnh Đẹp Trai','admin_f8@gmail.com','$2a$11$TLIWWU58ofqY3IBCmvNOSeMT.9BSf0uPcr1GanH8aLeYQ6aMUnkri','/users/avatars/user_36_638850622079521080.jpg',1,NULL,NULL,'2024-10-14 17:51:24','2025-06-08 19:51:47',2,'Xin chào, tôi là Huỳnh, lập trình viên chuyên về .NET và AI, yêu thích các giải pháp tự động hóa và luôn sẵn sàng học hỏi công nghệ mới để giải quyết các bài toán thực tiễn.','https://www.facebook.com/nguyenxuanhuynh2004','https://www.facebook.com/nguyenxuanhuynh2004','https://www.facebook.com/nguyenxuanhuynh2004','huynh','https://www.facebook.com/nguyenxuanhuynh2004',NULL),(41,'Nguyễn Thị Truyền','admin_f811@gmail.com','$2a$11$6AFw/nL9qAaHEx0BSy8XV.h8NDXGmYuydGP6xbBY6moy6a76Nit7W','/images/users/avatars/d36860ee80ca26ccbb00762f94080501.jpg',0,NULL,NULL,'2024-10-16 13:56:24','2024-12-22 15:35:42',1,'<h2>Xin chào các bạn!</h2><p>Đây là màn hình Thử Thách tại F8 các bạn nhé. Từ các bài học sau, các bạn sẽ có những bài tập cần phải vượt qua sau khi học mỗi kiến thức mới.</p><p>Hãy bắt đầu làm quen với màn Thử Thách này bằng cách làm theo yêu cầu dưới đây:</p><p>👉 Hãy nhấn copy và dán đoạn code sau vào file&nbsp;<span style=\"background-color: var(--prism-inline-code-bg, #c9fffc); color: var(--prism-inline-code-color);\">main.js</span>:</p><pre class=\"ql-syntax\" spellcheck=\"false\">alert(\'Hello world\');\n</pre><p><br></p><p>Sau đó, nhấn nút \"Kiểm tra\" để qua bài (alert có thể bật lên thêm vài lần sau khi nhấn kiểm tra).</p><blockquote>Tại trang web này, các bạn không cần phải liên kết file JavaScript (bằng cách internal hoặc external), vì F8 đã tự động làm điều này rồi các bạn nhé.</blockquote><p><br></p>','https://github.com/nguyenhuynhdt37/','https://github.com/nguyenhuynhdt37/',NULL,NULL,NULL,NULL),(54,'odasidoa','admin_f881@gmail.com',NULL,NULL,NULL,NULL,NULL,'2025-10-16 13:56:24','2024-10-16 13:56:24',1,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(55,'odasidoa','admin_f871@gmail.com',NULL,NULL,NULL,NULL,NULL,'2024-10-16 13:56:24','2024-10-16 13:56:24',1,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(56,'odasidoa','admin_f861@gmail.com',NULL,NULL,NULL,NULL,NULL,'2024-10-16 13:56:24','2024-10-16 13:56:24',1,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(57,'odasidoa','admin_f851@gmail.com',NULL,'/images/users/avatars/anh-trai-dep-deo-kinh-600x600.jpg',NULL,NULL,NULL,'2024-10-16 13:56:24','2024-10-16 13:56:24',1,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(59,'odasidoa','admin_f831@gmail.com',NULL,NULL,NULL,NULL,NULL,'2025-10-16 13:56:24','2024-10-16 13:56:24',1,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(66,'Linh Nguyễn','nguyenhu3ynhdt37121@gmail.com','$2a$11$hqAO5G0vWTOKGWqdteUFtuxfO/Ysw.ANCE1cJo8ypXH4YkCluRbPe',NULL,1,NULL,NULL,'2024-10-16 13:56:24','2024-10-16 13:56:24',1,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(67,'Linh Nguyễn','nguyenhu3yn3hdt37121@gmail.com','$2a$11$hqAO5G0vWTOKGWqdteUFtuxfO/Ysw.ANCE1cJo8ypXH4YkCluRbPe',NULL,1,NULL,NULL,'2024-10-16 13:56:24','2024-10-16 13:56:24',1,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(68,'Linh Nguyễn','nguyenhu3ynqhdt37121@gmail.com','$2a$11$hqAO5G0vWTOKGWqdteUFtuxfO/Ysw.ANCE1cJo8ypXH4YkCluRbPe',NULL,1,NULL,NULL,'2024-10-16 13:56:24','2024-10-16 13:56:24',1,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(69,'Linh Nguyễn','nguyenehu3ynhdt37121@gmail.com','$2a$11$hqAO5G0vWTOKGWqdteUFtuxfO/Ysw.ANCE1cJo8ypXH4YkCluRbPe',NULL,1,NULL,NULL,'2024-10-16 13:56:24','2024-10-16 13:56:24',1,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(70,'Linh Nguyễn','nguyenheuynhdt37121@gmail.com','$2a$11$hqAO5G0vWTOKGWqdteUFtuxfO/Ysw.ANCE1cJo8ypXH4YkCluRbPe',NULL,1,NULL,NULL,'2024-10-16 13:56:24','2024-10-16 13:56:24',1,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(71,'Linh Nguyễn','nguyenhu3ynehdt37121@gmail.com','$2a$11$hqAO5G0vWTOKGWqdteUFtuxfO/Ysw.ANCE1cJo8ypXH4YkCluRbPe',NULL,1,NULL,NULL,'2024-10-16 13:56:24','2024-10-16 13:56:24',1,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(86,'Nguyễn Thị Truyền','admin_f8222@gmail.com','$2a$11$3sYdW.McbRRCoek3knE.Du9IuqbmoGDQScmh6PLUltscE3LRpHt7G',NULL,1,NULL,NULL,'2024-10-16 13:56:24','2024-10-16 13:56:24',1,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(87,'Nguyễn Thị Truyền','admin1_f18@gmail.com','$2a$11$ya//pfyxqHWly5F9k/i8uefn6nXQjCKG6vEGbOJL0zjdCsjPRBdwG',NULL,1,NULL,NULL,'2025-10-16 13:56:24','2025-06-06 18:20:32',1,NULL,NULL,NULL,NULL,'nttruyn',NULL,NULL),(88,'Nguyễn Thị Truyền','admin11_f8@gmail.com','$2a$11$M2VStp.SsYteq9VdXxLVAeUOoukH6ysF1BQN87525T7o/MA6oWQ06',NULL,1,NULL,NULL,'2024-10-16 13:56:24','2025-06-06 18:20:31',1,NULL,NULL,NULL,NULL,'nttruyn1',NULL,NULL),(89,'Huỳnh Bảnh','nguyenhuynhtk37@gmail.com',NULL,'/users/avatars/785e94d8c028062dacf490f32f73ef58.png',1,NULL,NULL,'2024-10-16 13:56:24','2025-06-06 18:19:48',2,NULL,NULL,NULL,NULL,'',NULL,NULL),(90,'string','user@example.com','$2a$11$RFyPN45xNGzezCw448pVL.JyQUPOrn83923L6whJIDZ3g64E3jYJW','/users/avatars/img_42fdf719-447a-4408-9737-52014b172572.png',0,NULL,NULL,'2024-10-16 13:56:24','2024-10-16 13:56:24',1,NULL,NULL,NULL,NULL,'string',NULL,NULL),(91,'Huỳnh','22574802011019@vinhuni.edu.vn','$2a$11$zb5TFatTo9AQOvdTH/AWE.TPzotN1wGknR24cprPJ/.WJ0Hnj9qjW','/users/avatars/img_30921bd8-5695-4d79-b8ad-b8db04207a6b.jpg',1,NULL,NULL,'2024-10-16 13:56:24','2024-10-16 13:56:24',1,NULL,NULL,NULL,NULL,'huynh639',NULL,NULL),(92,'string','use1r@example.com','$2a$11$unqYOOCc4zskk/M9A.EhkuRxAWncfGEIR7dm74Z6L/xF7qkIMiJX.',NULL,0,NULL,NULL,'2024-10-16 13:56:24','2024-10-16 13:56:24',1,'string',NULL,NULL,NULL,'string339',NULL,NULL),(93,'string','user1@example.com','$2a$11$Gei6dd2nZUqljua2WiZu3ep0iag2uT0YhRB6vmT1F80waXc5D2K7W','/images/users/avatars/img_cd235741-0324-4a78-b31d-c3068bc32b62.jpg',0,NULL,NULL,'2024-10-16 13:56:24','2024-10-16 13:56:24',1,'string',NULL,NULL,NULL,'string694',NULL,NULL),(94,'string','user11@example.com','$2a$11$VuZh6VjwwQgBhTy.MuXVSens52jYx4hRUIdcOBjw2CqYHxQ885SVS',NULL,0,NULL,NULL,'2024-10-16 13:56:24','2024-10-16 13:56:24',1,'string',NULL,NULL,NULL,'string966',NULL,NULL),(95,'string','user111@example.com','$2a$11$FkzOI/UzRqPmBZqP7i4uX.XIDgey9bNjgQTS4UkLtUd1DDRcPjZqO',NULL,0,NULL,NULL,'2024-10-16 13:56:24','2024-10-16 13:56:24',1,'string',NULL,NULL,NULL,'string687',NULL,NULL),(96,'Huỳnh','225748020110191@vinhuni.edu.vn','$2a$11$rQpct46k8sh9IfHGE4qkPu9xCcS/P8uqs1F2kQEetJiW2r4GpxQbG','/images/users/avatars/img_25dcca53-2d9a-4310-89af-83d88d0c2b6e.jpg',1,NULL,NULL,'2024-10-16 13:56:24','2024-10-16 13:56:24',1,'<p>dadas</p>',NULL,NULL,NULL,'huynh464',NULL,NULL),(97,'Nguyễn Thị Truyền','admin_f81q1@gmail.com','$2a$11$iSYdIF1boowgd.taSqi8zecJYeFLUzu7VrTUcXuEHM/pj9zY.nasS','/images/users/avatars/img_ab059a0d-9781-457d-bea8-7af5887f7bd1.png',1,NULL,NULL,NULL,NULL,2,'<h2>dacsczcz</h2>',NULL,NULL,NULL,'nttruyen558',NULL,NULL);
/*!40000 ALTER TABLE `tbluser` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbluseractivelessonbycourse`
--

DROP TABLE IF EXISTS `tbluseractivelessonbycourse`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbluseractivelessonbycourse` (
  `userId` int NOT NULL,
  `courseId` int NOT NULL,
  `lessonId` int DEFAULT NULL,
  `groupId` int DEFAULT NULL,
  PRIMARY KEY (`userId`,`courseId`),
  KEY `tblUserActiveLessonByCourse_tblLectureDetails_FK` (`lessonId`),
  KEY `tblUserActiveLessonByCourse_tblCourse_FK` (`courseId`),
  KEY `tblUserActiveLessonByCourse_tblLessonGroup_FK` (`groupId`),
  CONSTRAINT `tblUserActiveLessonByCourse_tblCourse_FK` FOREIGN KEY (`courseId`) REFERENCES `tblcourse` (`id`),
  CONSTRAINT `tblUserActiveLessonByCourse_tblLectureDetails_FK` FOREIGN KEY (`lessonId`) REFERENCES `tbllecturedetails` (`id`),
  CONSTRAINT `tblUserActiveLessonByCourse_tblLessonGroup_FK` FOREIGN KEY (`groupId`) REFERENCES `tbllessongroup` (`id`),
  CONSTRAINT `tblUserActiveLessonByCourse_tblUser_FK` FOREIGN KEY (`userId`) REFERENCES `tbluser` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbluseractivelessonbycourse`
--

LOCK TABLES `tbluseractivelessonbycourse` WRITE;
/*!40000 ALTER TABLE `tbluseractivelessonbycourse` DISABLE KEYS */;
INSERT INTO `tbluseractivelessonbycourse` VALUES (32,3,33,1),(36,3,33,1);
/*!40000 ALTER TABLE `tbluseractivelessonbycourse` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblusercodes`
--

DROP TABLE IF EXISTS `tblusercodes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tblusercodes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `code_id` int DEFAULT NULL,
  `used_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `code_id` (`code_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `tblUserCodes_ibfk_1` FOREIGN KEY (`code_id`) REFERENCES `tblcode` (`id`),
  CONSTRAINT `tblUserCodes_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `tbluser` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblusercodes`
--

LOCK TABLES `tblusercodes` WRITE;
/*!40000 ALTER TABLE `tblusercodes` DISABLE KEYS */;
/*!40000 ALTER TABLE `tblusercodes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblusercompletelesson`
--

DROP TABLE IF EXISTS `tblusercompletelesson`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tblusercompletelesson` (
  `userId` int NOT NULL,
  `lessonId` int NOT NULL,
  `courseId` int NOT NULL,
  `createAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`userId`,`lessonId`),
  KEY `tblUserCompleteLesson_tblLectureDetails_FK` (`lessonId`),
  KEY `tblUserCompleteLesson_tblCourse_FK` (`courseId`),
  CONSTRAINT `tblUserCompleteLesson_tblCourse_FK` FOREIGN KEY (`courseId`) REFERENCES `tblcourse` (`id`),
  CONSTRAINT `tblUserCompleteLesson_tblLectureDetails_FK` FOREIGN KEY (`lessonId`) REFERENCES `tbllecturedetails` (`id`),
  CONSTRAINT `tblUserCompleteLesson_tblUser_FK` FOREIGN KEY (`userId`) REFERENCES `tbluser` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblusercompletelesson`
--

LOCK TABLES `tblusercompletelesson` WRITE;
/*!40000 ALTER TABLE `tblusercompletelesson` DISABLE KEYS */;
INSERT INTO `tblusercompletelesson` VALUES (32,33,3,'2025-05-13 01:30:48'),(32,35,3,'2025-06-05 20:56:42'),(32,49,3,'2025-05-06 16:26:03'),(32,53,3,'2025-05-10 14:52:10'),(32,58,3,'2025-05-10 14:51:45'),(32,61,42,'2025-05-13 01:22:53'),(36,33,3,'2025-06-02 01:05:17'),(36,34,3,'2025-06-02 01:05:34'),(36,35,3,'2025-06-02 01:05:37'),(36,48,3,'2025-05-08 12:51:50'),(36,49,3,'2025-05-08 16:52:14'),(36,51,3,'2025-06-02 12:30:31'),(36,55,3,'2025-06-05 13:13:58'),(36,58,3,'2025-05-13 15:08:09'),(36,59,42,'2025-05-13 11:07:03'),(36,61,42,'2025-05-13 16:22:19');
/*!40000 ALTER TABLE `tblusercompletelesson` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-09 15:30:12
