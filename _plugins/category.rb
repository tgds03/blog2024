module Jekyll
	class CategoryPageGenerator < Generator
	  safe true
  
	  def generate(site)
		@site = site
		# if site.layouts.key? 'category'
		#   dir = site.config['category_dir'] || 'categories'
		#   site.categories.each_key do |category|
		# 	site.pages << CategoryPage.new(site, site.source, File.join(dir, category), category)
		#   end
		# end
		searchDir('./post', ['post'])
	  end

	  def searchDir(pwd, categories)
		dirlist = Dir.entries(pwd).select { |d| File.directory?(File.join(pwd, d)) }
		dirlist.reject! { |d| d.start_with?('.', '_') }
		unless File.exist?(File.join(pwd, "index.html"))
			@site.pages << CategoryPage.new(@site, @site.source, pwd, categories, dirlist)
		end

		dirlist.map { |d| searchDir(File.join(pwd, d), categories + [d]) }
	  end
	end
  
	# A Page subclass used in the `CategoryPageGenerator`
	class CategoryPage < Page
	  def initialize(site, base, dir, category, children)
		@site = site
		@base = base
		@dir  = dir
		@name = 'index.html'

		self.process(@name)
		self.read_yaml(File.join(base, '_layouts'), 'category.html')
		self.data['categories'] = category
		self.data['children'] = children

		category_title_prefix = site.config['category_title_prefix'] || 'Category: '
		self.data['title'] = "#{category_title_prefix}#{category[-1]}"
	  end
	end
  end