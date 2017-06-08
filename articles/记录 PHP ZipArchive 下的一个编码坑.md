# 记录 PHP ZipArchive 下的一个编码问题


## 背景

公司有一些资料需要定时整理数据上传到服务器上，每个文件夹中都有一张图片和一个 zip 压缩包。我所做的是把图片上传作为缩略图，读取 zip 内的文件结构保存到数据库中。每个月执行一次，把新内容都上传一遍，一切都是那么的如丝般顺滑，直到前两天我发现读取出来 zip 内的中文文件名全都乱码了。于是开始了漫漫 debug 之路，断断续续查了两天终于解决了，在这里记录一下 debug 的过程以及怎么解决这个问题。

## 环境

- Windows 10
- PHP 5.6.15
- Cygwin64

## 发生了些什么？

举个栗子，在一个 zip 文件中有一个叫做 `源文件` 的文件夹，当我用 ZipArchive 读取他的文件结构时，出现了这种情况：

```php
$zip = new ZipArchive();
if ($zip->open('1.zip')) {
    echo $zip->getNameIndex(0);
}
// %￥……#￥%…… 
```

## DDDDDebug

出现乱码我首先想到的是在 Windows 下打包的文件名编码可能是 GBK 而输出是 UTF-8 所以失了智不对乱了码，于是尝试转编码：

```php
...
echo iconv('GBK', 'UTF-8//IGNORE', $zip->getNameIndex(0));
...
// %￥……#￥%…… 
```

然而并没有什么用，随后我尝试了所有可能的编码，输出的依旧是各种不同花样的乱码。

随后我猜想是不是 ZipArchive 在内部做过编码转换然而转的姿势不太对才使得输出的内容奇奇怪怪的？查看了一下 [ZipArchive 的文档](http://php.net/manual/en/ziparchive.getnameindex.php)，发现 `getNameIndex` 是有第二个参数的：

> flags
> If flags is set to ZipArchive::FL_UNCHANGED, the original unchanged name is returned.

诶这个好像挺对路，于是立马把这个参数加上了。结果。。。当然是失败了，不然这篇文章岂不是太短了。修改之后输出的乱码和之前的一毛一样完全没有区别。这就很尴尬了。

既然这样转那样转都不行我就看看二进制码吧？

把 `1.zip` 拖到了 UltraEdit 里，进了十六进制模式看了一看（当时没注意看右边的内容走了一些弯路），一堆数字字母看着有些眼花。

![](http://wx1.sinaimg.cn/mw690/5eaec197gy1fgdr919znqj20fv05pmx9.jpg)

文件头开头是 `50 4B 03 04`，搜索了一下发现这是 `pkzip`，然后再搜了下 `pkzip` 的结构，发现长这样：

![](https://ww1.sinaimg.cn/large/006tNc79gy1fgdrhb398tj30l5067q46.jpg)

<table width="500" border="0" cellspacing="2">
            <tbody><tr>
              <td width="150" valign="top">Signature</td>
              <td valign="top">The signature of the local file header. This is always '\x50\x4b\x03\x04'. </td>
            </tr>
            <tr>
              <td width="150" valign="top">Version</td>
              <td valign="top">PKZip version needed to extract </td>
            </tr>
            <tr>
              <td width="150" valign="top">Flags</td>
              <td valign="top">General purpose bit flag:<br>
                Bit 00: encrypted file<br>
                Bit 01: compression option <br>
                Bit 02: compression option <br>
                Bit 03: data descriptor<br>
                Bit 04: enhanced deflation<br>
                Bit 05: compressed patched data<br>
                Bit 06: strong encryption<br>
                Bit 07-10: unused<br>
                Bit 11: language encoding<br>
                Bit 12: reserved<br>
                Bit 13: mask header values<br>
                Bit 14-15: reserved              </td>
            </tr>
            <tr>
              <td width="150" valign="top">Compression method </td>
              <td valign="top">00: no compression<br>
                01: shrunk<br>
                02: reduced with compression factor 1<br>
                03: reduced with compression factor 2 <br>
                04: reduced with compression factor 3 <br>
                05: reduced with compression factor 4 <br>
                06: imploded<br>
                07: reserved<br>
                08: deflated<br>
                09: enhanced deflated<br>
                10: PKWare DCL imploded<br>
                11: reserved<br>
                12: compressed using BZIP2<br>
                13: reserved<br>
                14: LZMA<br>
                15-17: reserved<br>
                18: compressed using IBM TERSE<br>
                19: IBM LZ77 z<br>
                98: PPMd version I, Rev 1           <br></td>
            </tr>
            <tr>
              <td width="150" valign="top">File modification time </td>
              <td valign="top">stored in standard MS-DOS format:<br>
                Bits 00-04: seconds divided by 2 <br>
                Bits 05-10: minute<br>
                Bits 11-15: hour </td>
            </tr>
            <tr>
              <td width="150" valign="top">File modification date </td>
              <td valign="top">stored in standard MS-DOS format:<br>
                Bits 00-04: day<br>
                Bits 05-08: month<br>
                Bits 09-15: years from 1980 </td>
            </tr>
            <tr>
              <td width="150" valign="top">Crc-32 checksum </td>
              <td valign="top">value computed over file data by CRC-32 algorithm with 'magic number' 0xdebb20e3 (little endian) </td>
            </tr>
            <tr>
              <td width="150" valign="top">Compressed size </td>
              <td valign="top">if archive is in ZIP64 format, this filed is 0xffffffff and the length is stored in the extra field </td>
            </tr>
            <tr>
              <td width="150" valign="top">Uncompressed size </td>
              <td valign="top">if archive is in ZIP64 format, this filed is 0xffffffff and the length is stored in the extra field</td>
            </tr>
            <tr>
              <td width="150" valign="top">File name length </td>
              <td valign="top">the length of the file name field below </td>
            </tr>
            <tr>
              <td width="150" valign="top">Extra field length </td>
              <td valign="top">the length of the extra field below </td>
            </tr>
            <tr>
              <td width="150" valign="top">File name </td>
              <td valign="top">the name of the file including an optional relative path. All slashes in the path should be forward slashes '/'. </td>
            </tr>
            <tr>
              <td width="150" valign="top">Extra field </td>
              <td valign="top">Used to store additional information. The field consistes of a sequence of header and data pairs, where the header has a 2 byte identifier and a 2 byte data size field. </td>
            </tr>
          </tbody></table>
          
          
          
根据这个一步步看下去，最后发现文件名是 `D4 B4 CE C4 BC FE`，一对 GBK 码表，这不就是 源文件 三个字么。然而 ZipArchive 解析出来就是乱码。

期间我也问了几个 PHP 大佬，但是文件不好直接给大佬看大佬也不好判断，只好接着找问题了。

接着我用 `bin2hex()` 想看看输出的内容到底是什么：

```php
...
echo bin2hex($zip->getNameIndex(0));
...
// e29598e294a4e295ac....
```

输出了一段很长的，六位一组，以 `e2` 开头的东西，和我在 UltraEdit 里看到的完全不一样，经验也不足判断不了这是一串什么编码。但是从这可以知道 ZipArchive 里还是对这里做了处理的。于是决定翻一翻 PHP 源码看看能不能找到解决方法。

ZipArchive 相关的代码被放在了 `./php-src-master/ext/zip/` 里面了。搜索 `getNameIndex`，在 `php_zip.c` 里找到了这么一段代码：

```c++
/* {{{ proto string ZipArchive::getNameIndex(int index [, int flags])
Returns the name of the file at position index */
static ZIPARCHIVE_METHOD(getNameIndex)
{
	struct zip *intern;
	zval *self = getThis();
	const char *name;
	zend_long flags = 0, index = 0;

	if (!self) {
		RETURN_FALSE;
	}

	ZIP_FROM_OBJECT(intern, self);

	if (zend_parse_parameters(ZEND_NUM_ARGS(), "l|l",
			&index, &flags) == FAILURE) {
		return;
	}

	name = zip_get_name(intern, (int) index, flags);

	if (name) {
		RETVAL_STRING((char *)name);
	} else {
		RETURN_FALSE;
	}
}
```

那么很明显重点在 `name = zip_get_name(intern, (int) index, flags);` 这一句上。顺藤摸瓜继续找，在 `./lib/zip_get_name.c` 里发现了这个：

```c++
ZIP_EXTERN const char *
zip_get_name(zip_t *za, zip_uint64_t idx, zip_flags_t flags)
{
    return _zip_get_name(za, idx, flags, &za->error);
}

const char *
_zip_get_name(zip_t *za, zip_uint64_t idx, zip_flags_t flags, zip_error_t *error)
{
    zip_dirent_t *de;
    const zip_uint8_t *str;

    if ((de=_zip_get_dirent(za, idx, flags, error)) == NULL)
	return NULL;

    if ((str=_zip_string_get(de->filename, NULL, flags, error)) == NULL)
	return NULL;

    return (const char *)str;
}
```

分析一下，文件名应该就是通过 `str=_zip_string_get(de->filename, NULL, flags, error)` 这一句获得的了，感觉离我们要找的不远了，继续下去，我们在 `./lib/zip_string.c` 里找到了这个：

```c++
const zip_uint8_t *
_zip_string_get(zip_string_t *string, zip_uint32_t *lenp, zip_flags_t flags, zip_error_t *error)
{
   if ((flags & ZIP_FL_ENC_RAW) == 0) {
	/* start guessing */
	if (string->encoding == ZIP_ENCODING_UNKNOWN)
	    _zip_guess_encoding(string, ZIP_ENCODING_UNKNOWN);

	if (((flags & ZIP_FL_ENC_STRICT)
	     && string->encoding != ZIP_ENCODING_ASCII && string->encoding != ZIP_ENCODING_UTF8_KNOWN)
	    || (string->encoding == ZIP_ENCODING_CP437)) {
	    if (string->converted == NULL) {
		if ((string->converted=_zip_cp437_to_utf8(string->raw, string->length,
							  &string->converted_length, error)) == NULL)
		    return NULL;
	    }
	    if (lenp)
		*lenp = string->converted_length;
	    return string->converted;
	}
    }
    
    if (lenp)
	*lenp = string->length;
    return string->raw;
}
```

看了看代码，发现当 `(flags & ZIP_FL_ENC_RAW) == 0` 的时候才会对我们的文件名进行处理，猜编码转编码到 `UTF-8` 什么的。终于找到你了！

但我尝试把 `ZipArchive::FL_ENC_RAW` 加到代码里时提示我这个常量不存在。于是我就直接把 `ZIP_FL_ENC_RAW` 的值64带进去，`iconv('GBK', 'UTF8//IGNORE')` 一转，所有的中文都恢复了正常~

后来又 Google 了一番，发现文档在这里是提到了这个常量的

> ZipArchive::FL_ENC_RAW (integer)
Get unmodified string. Available as of PHP 7.0.8.
> http://php.net/manual/en/zip.constants.php

原来是我的 PHP 版本老了一些才用不了。


## 结论

ZipArchive 里自带的编码判断并不十分准确，如果碰到乱码问题最好还是自己手动转换一下编码比较稳妥。

如果你用的是 `PHP 7.0.8` 以上，那么只需要加一个 `ZipArchive::FL_ENC_RAW` flag就好了。

如果你还用的是 `PHP 7.0.8` 以下，那么可以尝试加上一个 64，就可以自己手动转换编码了，例如：

```php
...
$fileName = $zip->getNameIndex(0, 64);
$fileName = iconv('GBK', 'UTF-8//IGNORE', $fileName);
...
// 源文件
```

最后，PHP 7 大法好~ 以及真的要善用文档和 Google。

